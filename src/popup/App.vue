<template>
  <div class="dropkiq-popup">
    <div class="container-fluid">
      <div class="row p-2">
        <div class="col-12 p-0">
          <div class="form-group">
            <input v-model="expression" @click="getResults($event)" @keydown="getResults($event)" @focus="getResults($event)" placeholder="Liquid Expression" class="form-control" id="liquid-expression-field"></input>
          </div>
        </div>
        <div class="col-12 p-0">
          <button class="btn btn-secondary" :data-clipboard-text="expression">
            Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Describes your application's "Liquid Schema" (required)
// Generate this with https://github.com/akdarrah/dropkiq-gem for Ruby on Rails
var schema = {
  contacts: {
    methods: {
      name: {
        type: "ColumnTypes::String",
        foreign_table_name: null,
        hint: "The full name of the contact person"
      },
      email: {
        type: "ColumnTypes::String",
        foreign_table_name: null,
        hint: "The email address of the contact person"
      },
      age: {
        type: "ColumnTypes::Numeric",
        foreign_table_name: null,
        hint: "The computed age of the contact person"
      },
      is_minor: {
        type: "ColumnTypes::Boolean",
        foreign_table_name: null,
        hint: "Is true if the person is less than 18 years old"
      },
      birthdate: {
        type: "ColumnTypes::DateTime",
        foreign_table_name: null,
        hint: "The birthdate of the contact person"
      },
      notes: {
        type: "ColumnTypes::Text",
        foreign_table_name: null,
        hint: "Any notes that are saved in the database"
      },
      favorite_website: {
        type: "ColumnTypes::HasOne",
        foreign_table_name: "websites",
        hint: "The website the person visits most often"
      },
      visited_websites: {
        type: "ColumnTypes::HasMany",
        foreign_table_name: "websites",
        hint: "A list of websites the person has visited"
      }
    }
  },
  websites: {
    methods: {
      nickname: {
        type: "ColumnTypes::String",
        foreign_table_name: null,
        hint: "The nickname of the website"
      },
      url: {
        type: "ColumnTypes::String",
        foreign_table_name: null,
        hint: "The website HTTP URL address"
      }
    }
  }
};

// Describes what data the user has access to right now (required)
var context = {
  email_subject: {
    type: "ColumnTypes::String",
    foreign_table_name: null,
    hint: "The subject of the email to send"
  },
  email_body: {
    type: "ColumnTypes::Text",
    foreign_table_name: null,
    hint: "The body of the email to send"
  },
  email_from: {
    type: "ColumnTypes::String",
    foreign_table_name: null,
    hint: "The email address the email will be sent from"
  },
  email_contact: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "contacts",
    hint: "The contact who will receive the email"
  }
};

// Test data that is used for the preview feature (optional)
var scope = {
  email_subject: "Try Dropkiq Today!",
  email_body: "Work faster with a smarter editor. Write complex Liquid statements with ease. Dropkiq Autocompletion gives your users the confidence they need to write their statements correctly the first time.",
  email_from: "Adam Darrah <adam@dropkiq.com>",
  email_contact: {
    name: "John Doe",
    email: "john.doe@dropkiq.com",
    age: 30,
    is_minor: false,
    birthdate: Date.parse("March 18, 1990"),
    notes: "Software developer for application that uses liquid, but users don't fully understand how to use it...",
    favorite_website: {
      nickname: "Dropkiq",
      url: "https://www.dropkiq.com/"
    },
    visited_websites: [
      {nickname: "Dropkiq Ruby Gem", url: "https://github.com/akdarrah/dropkiq-gem"},
      {nickname: "Dropkiq UI", url: "https://github.com/akdarrah/dropkiq-ui"}
    ]
  }
};

var options = {};
var licenseKey = "";

// Initialize the Standard DropkiqUI for demo elements
// https://www.npmjs.com/package/dropkiq-ui
var dropkiqEngine = new DropkiqEngine("", 0, schema, context, scope, licenseKey);

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

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

    cb(matches);
  };
};

var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default {
  data () {
    return {
      expression: ""
    }
  },
  methods: {
    getResults(e) {
      var cursorIndex = e.target.selectionStart;
      var text = e.target.value;
      var result = dropkiqEngine.update(text, cursorIndex);
      chrome.extension.getBackgroundPage().console.log(result);
    }
  },
  mounted () {
    $('#liquid-expression-field', this.$el).typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'states',
      source: substringMatcher(states)
    });
  }
}
</script>

<style lang="scss" scoped>
.dropkiq-popup {
  width: 600px;
}
</style>
