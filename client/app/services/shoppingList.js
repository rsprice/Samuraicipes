angular.module('ShoppingListFactory', [])
  .factory('ShoppingList', ['Ingredient', 'User', function(Ingredient, User) {

    /**
     * Initialize List Array
     * @type {Array}
     */
    var list = [];

    var getList = function() {
      return {
        recipes: list,
        ingredients: getIngredientList()
      };
    };

    /**
     * Add a recipe to the list
     * @param {object} recipe [A recipe object in BigOven API format]
     */
    var addToList = function(recipe) {
      list.push(recipe);
      User.updateUserList(list);
    };

    /**
     * Returns the current list of recipes and ingredients
     * @return {[object]}
     */
    var getUserList = function() {
      var deferred = User.getUserList();
      if (deferred) {
        return deferred
          .then(function(userList) {
            if (userList) {
              list = userList;
            }
            return {
              recipes: list,
              ingredients: getIngredientList()
            };
          });
      } else {
        return {
          then: function() {
            return {
              recipes: list,
              ingredients: getIngredientList()
            };
          }
        };
      }
    };

    /**
     * Combines all recipes' ingredients and uses
     * Ingredient Factory to combine them.
     * @return {[array]} [List of all recipes' ingredients combined and formatted]
     */
    var getIngredientList = function() {
      var ingredientList = list.reduce(function(memo, recipe) {
        return memo.concat(recipe.extendedIngredients);
      }, []);
      return Ingredient.formatIngredientList(ingredientList);
    };

    /**
     * Remove a recipe from the list
     * @param  {[int]} id [id to be removed]
     */
    var removeFromList = function(id) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list.splice(i, 1);
          User.updateUserList(list);
        }
      }
    };

    /**
     * Returns true if recipe is already in the list
     * @param  {[object]} recipe [Recipe object]
     * @return {[boolean]}
     */
    var recipeInList = function(recipe) {

      for (var i = 0; i < list.length; i++) {
        if (list[i].id === recipe.id) {
          return true;
        }
      }
      return false;
    };

    return {
      addToList: addToList,
      getList: getList,
      getUserList: getUserList,
      getIngredientList: getIngredientList,
      removeFromList: removeFromList,
      recipeInList: recipeInList
    };

  }]);
