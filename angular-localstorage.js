/**
 * @license ngLocalStorage
 * (c) 2016 Jan Oetjen <oetjenj@gmail.com>
 * License: MIT
 */
(function (window, angular, storage) {
  'use strict'

  /**
   * @ngdoc module
   * @name ngLocalStorage
   * @description
   *
   * # ngLocalStorage
   *
   * The `ngLocalStorage` module provides a convenient wrapper for reading and writing from and to the browsers'
   * localStorage.
   *
   * <div doc-module-components="ngLocalStorage"></div>
   *
   * See {@link ngLocalStorage.$localStorage `$localStorage`} for usage.
   */

  angular.module('ngLocalStorage', ['ng'])
  /**
   * @ngdoc provider
   * @name $localStorageProvider
   * @description
   * Use `$localStorageProvider` to change the default behavior of the
   * {@link ngLocalStorage.$localStorage $localStorage} service.
   */
  .provider('$localStorage', [function () {
    /**
     * @ngdoc property
     * @name $localStorageProvider#defaults
     * @description
     *
     * Object containing the default options to pass when setting values in the localStorage.
     *
     * The object may have the following properties:
     *
     * - **prefix** - `{string}` - This will be prepended to any key when reading and writing values from the
     *   localStorage
     */
    var defaults = this.defaults = {}

    /**
     * @ngdoc service
     * @name $localStorage
     *
     * @description
     * Provide read/write access to browser's localStorage.
     *
     * @example
     * ```js
     * angular.module('localStorageExample', ['ngLocalStorage'])
     * .controller('ExampleController', ['$localStorage', function ($localStorage) {
     *   // Retrieve a value
     *   var favourite = $localStorage.get('myFavorite')
     *   // Setting a value
     *   $localStorage.put('myFavorite', 'oatmeal')
     * }])
     * ```
     */
    this.$get = [function () {
      return {
        /**
         * @ngdoc method
         * @name $localStorage#get
         *
         * @description
         * Returns the value of given localStorage key
         *
         * @param {string} key Id to use for lookup.
         * @param {Object} options Options object.
         *    See {@link ngLocalStorage.$localStorageProvider#defaults $localStorageProvider.defaults}
         *
         * @returns {string} Raw localStorage value.
         */
        get: function (key, options) {
          var opts = calcOptions(options)
          var keyName = [opts['prefix'], key].join('')

          return storage.getItem(keyName)
        },

        /**
         * @ngdoc method
         * @name $localStorage#getObject
         *
         * @description
         * Returns the deserialized value of given localStorage key
         *
         * @param {string} key Id to use for lookup.
         * @param {Object} options Options object.
         *    See {@link ngLocalStorage.$localStorageProvider#defaults $localStorageProvider.defaults}
         *
         * @returns {Object} Deserialized localStorage value.
         */
        getObject: function (key, options) {
          var opts = calcOptions(options)
          var keyName = [opts['prefix'], key].join('')
          var keyValue = this.get(keyName)

          return keyValue ? angular.fromJson(keyValue) : keyValue
        },

        /**
         * @ngdoc method
         * @name $localStorage#getAll
         *
         * @description
         * Returns a key value object with all localStorage entries
         *
         * @param {Object} options Options object.
         *    See {@link ngLocalStorage.$localStorageProvider#defaults $localStorageProvider.defaults}
         *
         * @returns {Object} All localStorage entries.
         */
        getAll: function (options) {
          var opts = calcOptions(options)
          var prefix = new RegExp(['^', opts['prefix']].join(''))
          var all = {}

          for (var key in storage) {
            if (storage.hasOwnProperty(key) && prefix.test(key)) {
              all[key] = this.getObject(key)
            }
          }

          return all
        },

        /**
         * @ngdoc method
         * @name $localStorage#put
         *
         * @description
         * Set a value for given localStorage key
         *
         * @param {string} key Id for the `value`.
         * @param {string} value Raw value to be stored.
         * @param {Object} options Options object.
         *    See {@link ngLocalStorage.$localStorageProvider#defaults $localStorageProvider.defaults}
         */
        put: function (key, value, options) {
          var opts = calcOptions(options)
          var keyName = [opts['prefix'], key].join('')

          storage.setItem(keyName, value)
        },

        /**
         * @ngdoc method
         * @name $localStorage#putObject
         *
         * @description
         * Serializes and sets a value for a given localStorage key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         * @param {Object} options Options object.
         *    See {@link ngLocalStorage.$localStorageProvider#defaults $localStorageProvider.defaults}
         */
        putObject: function (key, value, options) {
          this.put(key, angular.toJson(value), options)
        },

        /**
         * @ngdoc method
         * @name $localStorage#remove
         *
         * @description
         * Remove given localStorage entry
         *
         * @param {string} key Id of the key-value pair to delete.
         * @param {Object} options Options object.
         *    See {@link ngLocalStorage.$localStorageProvider#defaults $localStorageProvider.defaults}
         */
        remove: function (key, options) {
          var opts = calcOptions(options)
          var keyName = [opts['prefix'], key].join('')

          storage.removeItem(keyName)
        }
      }
    }]

    function calcOptions (options) {
      return options ? angular.extend({}, defaults, options) : defaults
    }
  }])
})(window, window.angular, window.localStorage)
