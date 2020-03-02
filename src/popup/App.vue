<template>
  <div class="dropkiq-popup">
    <div class="container-fluid">
      <div class="row p-2 first-row">
        <div class="col-1 p-0 text-center">
          <img src="icon_128.png" class="img-fluid dropkiq-logo p-2" alt="Dropkiq">
        </div>
        <div class="col-9 p-0 pt-1">
          <div class="form-group m-0">
            <input autofocus v-model="expression" @keydown="clearPreview()" placeholder="Liquid Expression" class="form-control no-border" id="liquid-expression-field"></input>
          </div>
        </div>
        <div class="col-2 p-0 pt-1 text-right">
          <button class="btn btn-dropkiq" id="copy-button" :data-clipboard-text="expression">
            Copy
          </button>
        </div>
      </div>
      <div class="row p-2 second-row">
        <div class="col-12 p-0">
          &rdsh;
          &nbsp;
          <span v-if="preview">
            {{ preview }}
          </span>
          <span v-else>
            Preview Unavailable
          </span>
          <img v-show="hint" src="question-circle.png" class="img-fluid dropkiq-question-mark" alt="Hint" :data-tippy-content="hint">
        </div>
      </div>
    </div>
  </div>
</template>

<script>

var schema = SCHEMA;
var context = {
  address: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "addresses",
    hint: "A test address"
  }
};

// Test data that is used for the preview feature (optional)
var scope = {
  address: {
    address1: "1329 Fletcher Ave",
    address2: "",
    city: "Indianapolis",
    company: "Dropkiq",
    country: "United States",
    country_code: "USA",
    first_name: "Adam",
    last_name: "Darrah",
    name: "Adam Darrah",
    phone: "3175047490",
    province: "",
    province_code: "",
    street: "1329 Fletcher Ave",
    url: "/addresses/123",
    zip: "46203"
  }
};

var options = {};
var licenseKey = "be8a0250-3af8-0138-0a72-4a36325215e0";

// Initialize the Standard DropkiqUI for demo elements
// https://www.npmjs.com/package/dropkiq-ui
var dropkiqEngine = new DropkiqEngine("", 0, schema, context, scope, licenseKey);

var substringMatcher = function(input, vm, tippy) {
  return function findMatches(q, cb) {
    var text = input.value;
    var cursorIndex = input.selectionStart;
    var result = dropkiqEngine.update(("{{" + text + "}}"), (cursorIndex + 2));

    var strs, matches, substringRegex;

    // All possible match strings
    var splitText = (text.length === 0 ? [] : text.split('.'));
    var prePeriodPath = splitText.slice(0, -1);

    strs = result.suggestionsArray.map(function(suggestion){
      if(prePeriodPath.length){
        var fullPath = prePeriodPath.concat(suggestion.name);
        return fullPath.join(".");
      } else {
        return suggestion.name;
      }
    });

    // chrome.extension.getBackgroundPage().console.log(strs);

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    var substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    vm.preview = result.preview;
    var match = matches[0];
    if(match){
      let suggestion = result.suggestionsArray.find(function(suggestion){
        var name = match.split(".").pop();
        return suggestion.name = name;
      });

      if(suggestion){
        vm.preview = suggestion.preview;
        vm.hint = suggestion.hint;
        tippy.setContent(vm.hint);
      }
    }

    cb(matches);
  };
};

export default {
  data () {
    return {
      expression: "",
      preview: "",
      hint: ""
    }
  },
  methods: {
    clearPreview() {
      this.preview = "";
      this.hint = "";
    }
  },
  mounted () {
    var $el = $('#liquid-expression-field', this.$el);
    var tippyInstance = tippy('[data-tippy-content]', {
      placement: "left-end"
    });

    $el.typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'states',
      source: substringMatcher($el[0], this, tippyInstance[0])
    });

    var that = this;
    $el.bind('typeahead:autocomplete', function(ev, suggestion){
      that.expression = suggestion;
    });

    var $copyButton = $('#copy-button', this.$el);
    $el.keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13'){
        $copyButton.click();
      }
    });

    $copyButton.on('click', function(){
      setTimeout(function(){
        window.close();
      }, 25);
    });
  }
}
</script>

<style lang="scss" scoped>
.dropkiq-popup {
  width: 600px;
}
</style>
