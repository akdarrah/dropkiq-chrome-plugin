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
  product: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "products",
    hint: "An example product object from all_products."
  },
  article: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "articles",
    hint: "An example product object from articles."
  },
  blogs: {
    type: "ColumnTypes::HasMany",
    foreign_table_name: "blogs",
    hint: "The blogs object returns all the blogs in your store."
  },
  canonical_url: {
    type: "ColumnTypes::String",
    foreign_table_name: null,
    hint: "The canonical_url object returns the canonical URL for the current page. The canonical URL is the page's \"default\" URL with any URL parameters removed."
  },
  cart: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "carts",
    hint: "The cart object returns your store's cart."
  },
  collections: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "collections",
    hint: "The collections object returns all the collections in your store."
  },
  current_page: {
    type: "ColumnTypes::Numeric",
    foreign_table_name: null,
    hint: "The current_page object returns the number of the page a customer is on when browsing through paginated content."
  },
  current_tags: {
    type: "ColumnTypes::YAML",
    foreign_table_name: null,
    hint: "The current_tags object will return a different list of tags depending on the template that is being rendered."
  },
  customer: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "customers",
    hint: "The customer object returns the customer that is logged in to the store. It will not return anything if a customer isn't logged in."
  },
  linklists: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "linklists",
    hint: "The linklists object returns the set of the menus and links in your store. You can access a menu by calling its handle on the linklists object."
  },
  handle: {
    type: "ColumnTypes::String",
    foreign_table_name: null,
    hint: "The handle object returns the handle of the page that is being viewed."
  },
  image: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "images",
    hint: "An example image object from images"
  },
  page: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "pages",
    hint: "An example page object from pages"
  },
  page_description: {
    type: "ColumnTypes::String",
    foreign_table_name: null,
    hint: "The page_description object returns the description of the product, collection, or page that is being rendered. Descriptions for these items can be set in your Shopify admin."
  },
  page_title: {
    type: "ColumnTypes::String",
    foreign_table_name: null,
    hint: "The page_title object returns the title of the current page."
  },
  recommendations: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: 'recommendations',
    hint: "The recommendations object returns product recommendations when used in a section rendered through an HTTP request to /recommendations/products?section_id=<section_id>&product_id=<product_id>, where section_id is the id of the section, and product_id is the id of the product that you want to show recommendations for. In order to show the section, you must make the request using JavaScript and insert the response's HTML on the page."
  },
  shop: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: 'shops',
    hint: "The shop object contains information about your store."
  },
  scripts: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: 'scripts',
    hint: "The scripts object returns information about a store's active scripts."
  },
  settings: {
    type: "ColumnTypes::YAML",
    foreign_table_name: null,
    hint: "The settings object lets you access the settings of a store's published theme."
  },
  template: {
    type: "ColumnTypes::String",
    foreign_table_name: null,
    hint: "The template object returns the name of the template that is being used to render the current page, not including its .liquid file extension. As a best practice, it's recommended that you apply the template name as a CSS class on your HTML <body> tag."
  },
  theme: {
    type: "ColumnTypes::HasOne",
    foreign_table_name: "themes",
    hint: "The theme object returns the store's published theme."
  },
  content_for_header: {
    type: "ColumnTypes::Text",
    foreign_table_name: null,
    hint: "The content_for_header object is required in theme.liquid. It must be placed inside the HTML <head> tag. It dynamically loads all scripts required by Shopify into the document head. These scripts include Shopify analytics, Google Analytics, and scripts required for Shopify apps."
  },
  content_for_index: {
    type: "ColumnTypes::Text",
    foreign_table_name: null,
    hint: "The content_for_index object contains the content of dynamic sections to be rendered on the home page. This object must be included in templates/index.liquid."
  },
  content_for_layout: {
    type: "ColumnTypes::Text",
    foreign_table_name: null,
    hint: "The content_for_layout object is required in theme.liquid. It must be placed inside the HTML <body> tag. It dynamically loads content generated by other templates such as index.liquid or product.liquid."
  }
};

var exampleImage = {
  alt: "Test Image",
  aspect_ratio: "100/100",
  "attached_to_variant?": false,
  height: 100,
  id: 3,
  position: 0,
  product_id: 3,
  src: "products/my_image.jpg",
  variants: [],
  width: 100
}

var exampleUnitPriceMeasurement = {
  measured_type: "volume",
  quantity_unit: "l",
  quantity_value: 2.5,
  reference_unit: "ml",
  reference_value: 100
}

var exampleVariant = {
  available: true,
  barcode: "1010100",
  compare_at_price: 1.00,
  id: 10,
  image: exampleImage,
  incoming: true,
  inventory_management: null,
  inventory_policy: "continue",
  inventory_quantity: 100,
  next_incoming_date: Date.parse("2019-11-01 05:56:37 -0400"),
  option1: "Red",
  option2: "Green",
  option3: "Blue",
  price: 100.00,
  requires_shipping: false,
  selected: true,
  sku: "1b23",
  taxable: true,
  title: "Red Variant",
  unit_price: 7.00,
  unit_price_measurement: exampleUnitPriceMeasurement,
  url: "http://my-store.myshopify.com/products/t-shirt?variant=12345678",
  weight: 100.00,
  weight_unit: "",
  weight_in_unit: ""
}

var exampleProduct = {
  available: true,
  collections: [],
  compare_at_price: 10.00,
  compare_at_price_max: 50.00,
  compare_at_price_min: 10.00,
  compare_at_price_varies: true,
  content: "An example product",
  created_at: Date.parse("2019-11-01 05:56:37 -0400"),
  description: "An example product",
  featured_image: exampleImage,
  featured_media: "",
  first_available_variant: { exampleVariant },
  handle: "product",
  has_only_default_variant: true,
  id: 1,
  images: [exampleImage],
  options: ["Color", "Size", "Material"],
  price: 15.00,
  price_max: 50.00,
  price_min: 10.00,
  price_varies: true,
  published_at: Date.parse("2019-11-01 05:56:37 -0400"),
  selected_variant: exampleVariant,
  selected_or_first_available_variant: exampleVariant,
  tags: ["new", "leather", "sale", "special"],
  template_suffix: "wholesale",
  title: "Test Product",
  type: null,
  url: "/products/awesome-shoes",
  variants: [exampleVariant],
  vendor: "Vendor Name"
}

var exampleUser = {
  account_owner: true,
  bio: "An example user",
  email: "example@gmail.com",
  first_name: "John",
  homepage: "http://dropkiq.com",
  image: exampleImage,
  last_name: "Doe"
}

var exampleArticle = {
  author: "John Doe",
  comments: [],
  comments_count: 0,
  "comments_enabled?": false,
  comment_post_url: "/blogs/news/10582441-sale-starts-today/comments",
  content: "Example Article content",
  created_at: Date.parse("2019-11-01 05:56:37 -0400"),
  excerpt: "Example Article content",
  excerpt_or_content: "Example Article content",
  handle: 'article',
  id: 123,
  image: exampleImage,
  "moderated?": false,
  published_at: Date.parse("2019-11-01 05:56:37 -0400"),
  tags: ["news"],
  title: "Example Article",
  updated_at: Date.parse("2019-11-01 05:56:37 -0400"),
  url: "/blogs/news/10582441-my-new-article",
  user: exampleUser
}

var examplePage = {
  author: "John Doe",
  content: "Sample page content",
  handle: "page",
  id: 45,
  published_at: Date.parse("2019-11-01 05:56:37 -0400"),
  template_suffix: "contact",
  title: "Page Title",
  url: "/pages/about-us"
}

var exampleTheme = {
  id: 1,
  name: "Test Theme"
}

var exampleTemplate = {
  directory: "customers",
  name: "product",
  suffix: "alternate"
}

var exampleAddress = {
  address1: "123 Example St.",
  address2: "Apartment 1",
  city: "Indianapolis",
  company: "Dropkiq",
  country: "United States",
  country_code: "USA",
  first_name: "Adam",
  last_name: "Darrah",
  name: "Adam Darrah",
  phone: "3176574356",
  province: "",
  province_code: "",
  street: "123 Example St., Apartment 1",
  url: "/addresses/123",
  zip: "46203"
}

var exampleBlog = {
  all_tags: ["News"],
  articles: [exampleArticle],
  articles_count: 1,
  "comments_enabled?": false,
  handle: "blog",
  id: 1,
  "moderated?": false,
  next_article: exampleArticle,
  previous_article: exampleArticle,
  tags: ["News"],
  title: "Test Blog",
  url: "/blog"
}

var exampleDiscoutApplication = {
  target_selection: "all",
  target_type: "line_item",
  title: "Welcome10",
  total_allocated_amount: 10.00,
  type: "discount_code",
  value: 10.00,
  value_type: "fixed_amount"
}

var exampleLineItem;
var exampleFulfillment = {
  fulfillment_line_items: [exampleLineItem],
  item_count: 1,
  tracking_company: "Tracktor",
  tracking_number: "12345",
  tracking_url: "http://wwwapps.ups.com/etracking/tracking.cgi?InquiryNumber1=1Z5F44813600X02768&TypeOfInquiryNumber=T&AcceptUPSLicenseAgreement=yes&submit=Track"
}

exampleLineItem = {
  discount_allocations: [],
  final_line_price: 60.00,
  final_price: 60.00,
  fulfillment: exampleFulfillment,
  fulfillment_service: "manual",
  gift_card: false,
  grams: 100,
  image: exampleImage,
  key: '17285644550:70ff98a797ed385f6ef25e6e974708ca',
  line_level_discount_allocations: [],
  line_level_total_discount: 0.00,
  message: "Example Message",
  options_with_values: [],
  original_line_price: 60.00,
  original_price: 60.00,
  product: exampleProduct,
  product_id: 124,
  properties: [],
  quantity: 1,
  requires_shipping: false,
  sku: 'abcde',
  successfully_fulfilled_quantity: 1,
  taxable: true,
  title: "Example Line Item",
  unit_price: 60.00,
  unit_price_measurement: exampleUnitPriceMeasurement,
  url: "mystore.myshopify.com",
  variant: exampleVariant,
  variant_id: 100,
  vendor: "Example Vendor",
  id: 123
}

var exampleShippingMethod = {
  handle: "product",
  original_price: 12.99,
  price: 7.89,
  title: "International Shipping"
}

var exampleTaxLine = {
  price: 25.00,
  rate: 0.14,
  rate_percentage: 14,
  title: "GST"
}

var exampleTransaction = {
  amount: 12.99,
  created_at: Date.parse("2019-11-01 05:56:37 -0400"),
  gateway: "Cash on Delivery (COD)",
  id: 123,
  kind: "authorization",
  name: "c251556901.1",
  payment_details: {
    credit_card_company: "Visa",
    credit_card_number: "•••• •••• •••• 1234"
  },
  receipt: "Example transaction receipt...",
  status: "Success",
  status_label: "Réussite"
}

var exampleCustomer;
var exampleOrder = {
  attributes: [],
  billing_address: exampleAddress,
  cancelled: false,
  cancelled_at: null,
  cancel_reason: null,
  cancel_reason_label: null,
  cart_level_discount_applications: [exampleDiscoutApplication],
  created_at: Date.parse("2019-11-01 05:56:37 -0400"),
  customer: exampleCustomer,
  customer_url: "http://johns-apparel.myshopify.com/account/orders/d94ec4a1956f423dc4907167c9ef0413",
  discount_applications: [exampleDiscoutApplication],
  email: "example@gmail.com",
  financial_status: "pending",
  financial_status_label: "Payée",
  fulfillment_status: "Unfulfilled",
  fulfillment_status_label: "Non confirmée",
  line_items: [exampleLineItem],
  line_items_subtotal_price: 60.00,
  location: null,
  name: "#1025",
  note: "Special instructions: Please deliver after 5 PM",
  order_number: "1025",
  order_status_url: "",
  phone: "3175476789",
  shipping_address: exampleAddress,
  shipping_methods: [exampleShippingMethod],
  shipping_price: 12.00,
  subtotal_price: 45.00,
  tags: ["new"],
  tax_lines: [exampleTaxLine],
  tax_price: 5.35,
  total_discounts: 20.00,
  total_net_amount: 35.00,
  total_price: 60.00,
  total_refunded_amount: 0.00,
  transactions: [exampleTransaction]
}

exampleCustomer = {
  addresses_count: 1,
  default_address: exampleAddress,
  email: "example@gmail.com",
  first_name: "john",
  has_account: true,
  id: 1234,
  last_name: "Doe",
  last_order: exampleOrder,
  name: "John Doe",
  orders: [exampleOrder],
  orders_count: 1,
  phone: "3175678989",
  tags: ["wholesale"],
  tax_exempt: false,
  total_spent: 5.00
}

var examplePolicy = {
  body: "The policy's body",
  title: "A nice policy",
  url: "/policies/shipping-policy"
}

var exampleLocale = {
  endonym_name: "français canadien",
  iso_code: "fr-CA",
  name: "Canadian French",
  primary: false,
  root_url: "/fr-ca"
}

var exampleCurrency = {
  name: "United States dollars",
  iso_code: "USD",
  symbol: "$"
}

var exampleShop = {
  address: exampleAddress,
  collections_count: 1,
  currency: "USD",
  description: "A test store",
  domain: "example.com",
  email: "example@gmail.com",
  enabled_currencies: [exampleCurrency],
  enabled_payment_types: [],
  metafields: [],
  name: "Example Store",
  password_message: "",
  permanent_domain: ".myshopify.com",
  phone: "3165678788",
  policies: [examplePolicy],
  privacy_policy: examplePolicy,
  published_locales: [exampleLocale],
  refund_policy: examplePolicy,
  shipping_policy: examplePolicy,
  terms_of_service: examplePolicy,
  products_count: 1,
  secure_url: "https://johns-apparel.com",
  taxes_included: true,
  url: "http://johns-apparel.com"
}

var exampleCart = {
  attributes: {},
  cart_level_discount_applications: [exampleDiscoutApplication],
  currency: exampleCurrency,
  discount_applications: [exampleDiscoutApplication],
  item_count: 1,
  items: [exampleLineItem],
  items_subtotal_price: 85.00,
  note: "Hope you like the gift, Kylea!",
  original_total_price: 85.00,
  total_discount: 5.00,
  total_price: 80.00,
  total_weight: 50.00
}

var exampleCollection = {
  all_products_count: 24,
  all_tags: ["Bags"],
  all_types: ["Accessories"],
  all_vendors: ["Montezuma"],
  current_type: 'Shirts',
  current_vendor: 'ApparelCo',
  default_sort_by: 'manual',
  description: "The description of the collection",
  handle: "page",
  id: 12,
  image: exampleImage,
  next_product: exampleProduct,
  previous_product: exampleProduct,
  products: [exampleProduct],
  products_count: 1,
  published_at: Date.parse("2019-11-01 05:56:37 -0400"),
  sort_by: "best-selling",
  sort_options: [{value: "manual", name: 'Featured'}],
  template_suffix: "no-price",
  title: "Frontpage",
  tags: ["New"],
  url: "/collections/123"
}

var exampleLink = {
  active: false,
  child_active: false,
  current: false,
  child_current: false,
  levels: 1,
  links: [],
  object: exampleProduct,
  title: "Product Link",
  type: "product_link",
  url: "/products/123"
}

var exampleLinklist = {
  handle: "product",
  levels: 1,
  links: [exampleLink],
  title: "Linklist"
}

var exampleRecommendations = {
  performed: true,
  products_count: 1,
  products: [exampleProduct]
}

var exampleScripts = {
  id: 123,
  name: "Test Script Name"
}

// Test data that is used for the preview feature (optional)
var scope = {
  canonical_url: "https://docksupply.co/products/dory-shoes",
  current_page: 0,
  page_description: "An example page description",
  page_title: "Example Page",
  product: exampleProduct,
  article: exampleArticle,
  image: exampleImage,
  page: examplePage,
  theme: exampleTheme,
  template: exampleTemplate,
  blogs: [exampleBlog],
  shop: exampleShop,
  cart: exampleCart,
  collections: exampleCollection,
  linklists: exampleLinklist,
  current_tags: ["One", "Two", "Three"],
  handle: "page",
  recommendations: exampleRecommendations,
  scripts: exampleScripts,
  content_for_header: "\<script\>...\<\/script\>",
  content_for_index: "<p>...</p>",
  content_for_layout: "<p>...</p>"
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
        if($(".tt-suggestion:first-child").length){
          var e = $.Event('keydown');
          e.which = 9; // Simulate Tab
          $el.trigger(e);
        } else {
          $copyButton.click();
        }
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
