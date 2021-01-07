'use strict';
const Alexa = require('ask-sdk-v1adapter');
const APP_ID = undefined;

/***********
Data: Customized alexa skill data.
***********/

const SKILL_NAME = "Stacked";
const STOP_MESSAGE = "I'm gonna shut down then. See you next time.";
const CANCEL_MESSAGE = "Okay. Do you want to hear a different recipe instead?";

const HELP_START = "I know how to make tasty sandwiches.";
const HELP_START_REPROMPT = "Just tell me what type of sandwich you'd like.";
const HELP_RECIPE = "Choose whatever sandwich you want. Do you want to proceed?";
const HELP_RECIPE_REPROMPT = "Choose whatever sandwich you want. Do you want to proceed?";
const HELP_INSTRUCTIONS = "You can ask me to repeat the instructions or say 'next' to hear the next line of instructions.";
const HELP_INSTRUCTIONS_REPROMPT = "You can ask me to repeat the instructions or say 'next' to hear the next line of instructions.";
const HELP_CANCEL = "You can hear a new recipe or just not make anything for now.";
const HELP_CANCEL_REPROMPT = "Not eating so far caused me to feel hungry.";

const CHOOSE_TYPE_MESSAGE = `Welcome to ${SKILL_NAME}! I know some great sandwiches for breakfast, lunch, snack, or dinner. What kind of sandwich are you looking for?`;
const REPROMPT_TYPE = "You can choose a sandwich recipe for breakfast, lunch, snack, or dinner. What type of recipe would you like to choose?";
const MEALTYPE_NOT_IN_LIST = chosenType => `Sorry, I couldn't find any recipes for ${chosenType}. Do you want a breakfast, lunch, dinner or snack sandwich?`;

const RECIPE_ADJECTIVES = [
  "awesome",
  "super simple",
  "fun",
  "extremely tasty"
];
const SUGGEST_RECIPE = recipeName => `I found this ${_pickRandom(RECIPE_ADJECTIVES)} ${recipeName} sandwich. Do you want me to tell you how to make ${recipeName}?`;
const MISUNDERSTOOD_RECIPE_ANSWER = "Please answer with yes or no.";
const NO_REMAINING_RECIPE = "This was it. I don't know any more recipes. Do you want to select a different meal type?"
const INGREDIENTS_INTRO = "You will need"; // Here follows a list of ingredients
const INGREDIENTS_ENDING = "Does that sound like a meal you want to eat?"; // Will be said after the list of ingredients


const FIRST_TIME_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const REPROMPT_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry, I didn't understand you there.";
const CLOSING_MESSAGE = "Hope you have a great meal.";

const recipes = {
  breakfast: [
    {
      name: "Peanut Butter and Jelly",
      instructions: [
        "Find some sandwich bread.",
        "Spread a thick layer of peanut butter onto the bread.",
        "Dump a huge spoonful of jelly on top of the peanut butter and spread it.",
        "There you go. You just made a delicious peanut butter and jelly sandwich."
      ],
      ingredients: [
        "peanut butter",
        "jelly",
        "2 slices of bread"
      ]
    },
    {
      name: "Ham and Cheese",
      instructions: [
        "Preheat a skillet over medium-high heat.",
        "Spread each slice of bread with 1 teaspoon butter.",
        "Place one slice, butter-side down in the hot skillet.",
        "Top the bread in the skillet with Swiss cheese and ham.",
        "Take the second slice of bread and spread mayonnaise and mustard on the unbuttered side.",
        "Place it, butter-side up on top of the ham in the skillet.",
        "Cook until the sandwich is golden brown.",
        "The sandwich is now done."
      ],
      ingredients: [
        "2 slices of bread",
        "2 teaspoons butter",
        "2 slices of Swiss cheese",
        "2 slices of ham",
        "1 teaspoon of mayonnaise",
        "1 teaspoon of mustard"
      ]
    },
    {
      name: "Bacon and Eggs",
      instructions: [
        "Spread a thin layer of oil on a pan and start heating it on the stove.",
        "Throw the bacon strips into the pan and wait until the bacon is significantly darker and crispy.",
        "Take out the bacon and put it aside.",
        "Get the eggs and crack them gently so the yolk can fall into the pan.",
        "The eggs are done when all the egg white has become fully white and the yoke is still slightly liquid.",
        "Place cooked bacon and eggs between the 2 slices of bread",
        "That's what I call an awesome breakfast."
      ],
      ingredients: [
        "4 strips of bacon",
        "2 eggs",
        "1 teaspoon of oil or butter",
        "2 slices of bread"
      ]
    }
  ],
  lunch: [
    {
      name: "Tuna Salad",
      instructions: [
        "Place the tuna in a mixing bowl and break it up with a fork.",
        "Add the mayo, mustard, and seasonings to the bowl. Mix to combine.",
        "Enjoy immediately with bread and lettuce leaves.",
        "Great. Sandwich completed."
      ],
      ingredients: [
        "1 5-ounce can of drained tuna",
        "2 tablespoons mayo",
        "1 tablespoon dijon mustard",
        "salt and pepper to taste",
        "2 slices of bread",
        "lettuce leaves"
      ]
    },
    {
      name: "Chicken Salad",
      instructions: [
        "In a medium bowl, mix together mayonnaise, lemon juice, and pepper.",
        "Add the chicken and celery. Mix to combine.",
        "Add the desired amount of the mixture to the slices of bread.",
        "And that's it. Your sandwich is done."
      ],
      ingredients: [
        "½ cup mayonnaise",
        "1 tablespoon lemon juice",
        "¼ teaspoon ground black pepper",
        "2 cups chopped, cooked chicken meat",
        "1 stalk celery, chopped",
        "2 slices of bread"
      ]
    },
    {
      name: "Egg Salad",
      instructions: [
        "Peel the eggs and mash them into chunks in a bowl.",
        "Add mustard, mayonnaise, salt and pepper. Mix until well.",
        "Assemble the sandwiches with the egg salad filling, lettuce, and tomato as you desire.",
        "There you have it. A masterpiece if I do say so myself. Well done."
      ],
      ingredients: [
        "6 hard boiled eggs",
        "4 Tablespoons of mayonnaise",
        "1 teaspoon of mustard",
        "Salt and pepper to taste",
        "sandwich bread slices",
        "lettuce and tomatoes for serving"
      ]
    }
  ],
  dinner: [
    {
      name: "Sausage and Peppers", 
      instructions: [
        "In a large non-stick frying pan, heat up the oil until it is hot",
        "Add in the sausages and fry them until they are golden brown on all sides.",
        "Remove the fried sausages from the pan with a slotted spoon and set them aside in a large bowl.",
        "Add the onions and peppers to the pan.Cook them until they are brown on the edges.",
        "Add the sausage back into the pot and give everything one last stir.",
        "Place your desired amount of the mixture between a sandwich roll.",
        "That's all there is to it. Well done."
      ],
      ingredients: [
        "2 slices of bread",
        "1 teaspoon of oil",
        "1 pound of sausage, cut into coins",
        "1 green pepper, cut into large chunks",
        "1 red pepper, cut into large chunks"
      ]
    },
    {
      name: "Meatball Sub",
      instructions: [
        "Place bread into toaster oven to keep warm.",
        "Pour the tomato sauce and tomato paste in a large pot.",
        "Stir in the meatballs and cover the pot on medium heat until meatballs are hot.",
        "Once the meatballs are done, lay them in the hot dog roll and top with cheese.",
        "That's it. Mmmmh, I bet it smells really good. Enjoy your sub."
      ],
      ingredients: [
        "2 8-ounce cans of tomato sauce",
        "3 tablespoons of tomato paste",
        "24 appetizer Italian meatballs",
        "6 hot dog rolls",
        "6 slices of cheese"
      ]
    },
    {
      name: "Chickpea Curry",
      instructions: [
        "Put the curry paste and chickpeas in a frying pan and cook over a low heat.",
        "Add the tomatoes and coconut, then bring the pan to a gentle simmer.",
        "Cook the pan until the curry looks thick and glossy.",
        "Once done cooking, add some of the curry mixture to your sandwich roll.",
        "Perfect. You are ready to enjoy your sandwich."
      ],
      ingredients: [
        "2 tablespoons of curry paste",
        "1 15-ounce can of chickpeas, drained and rinsed",
        "1 8-ounce can of chopped tomatoes",
        "1 ounce of creamed coconut",
        "sandwich rolls"
      ]
    }
  ],
  snack: [
    {
      name: "Veggie and Hummus",
      instructions: [
        "Spread one slice of bread with hummus.",
        "Spread the other slice of bread with avocado.",
        "Stack the greens, bell pepper, cucumber and carrot on the slice of bread.",
        "Top the sandwich off with the other slice of bread.",
        "Enjoy."
      ],
      ingredients: [
        "2 slices of pita bread",
        "3 tablespoons of hummus",
        "¼ avocado, mashed",
        "½ cup mixed salad greens",
        "¼ medium red bell pepper, sliced",
        "¼ cup sliced cucumber",
        "¼ cup shredded carrot"
      ]
    },
    {
      name: "Grilled Cheese",
      instructions: [
        "Preheat a skillet over medium-low heat.",
        "Sandwich 2 slices of cheese between 2 slices of bread.",
        "Spread or brush the outside of the sandwich with butter.",
        "Place sandwich in the skillet and cook until the bread is lightly browned.",
        "Flip the sandwich and continue cooking until the other side is browned and the cheese is melted.",
        "Well done. Enjoy your sandwich filled with cheesy goodness."
      ],
      ingredients: [
        "2 slices of cheese",
        "2 slices of bread",
        "1 tablespoon of butter or oil"
      ]
    },
    {
      name: "Avocado and Tomato",
      instructions: [
        "Mix mashed avocado and garlic salt together in a bowl.",
        "Spread avocado mixture onto slice of bread.", 
        "Layer tomatoes over avocado and top with black pepper.",
        "Lovely. Enjoy your snack."
      ],
      ingredients: [
        "½ avocado. peeled, pitted, and mashed",
        "1 teaspoon of garlic salt",
        "1 slice of bread",
        "3 slices of tomato",
        "1 pinch of ground black pepper"
      ]
    }
  ]
};

/***********
Execution Code: Only edit if comfortable with JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)

const _getCurrentStep = handler => handler.attributes['instructions'][handler.attributes['current_step']];

const _intentAndSlotPresent = handler => {
  try {
    return handler.event.request.intent.slots.mealType;
  }
  catch (e){
    return false;
  }
};
const _selectedMealType = handler => {
  return _intentAndSlotPresent(handler) && handler.event.request.intent.slots.mealType.value;
};
const _checkMealTypePresence = handler => {
  return Object.keys(recipes).includes(_selectedMealType(handler));
};
const _setMealType = handler => {
  // Reset remaining recipes in case the user went back from before
  handler.attributes['mealType'] = _selectedMealType(handler);
  handler.attributes['remainingRecipes'] = recipes[handler.attributes['mealType']];
  handler.handler.state = states.RECIPEMODE;
  handler.emitWithState("Recipe");
  return true;
};

const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _pickRandom = (array) => array[_randomIndexOfArray(array)];

// Handle user input and intents:

const states = {
  STARTMODE: "_STARTMODE",
  RECIPEMODE: "_RECIPEMODE",
  INSTRUCTIONSMODE: "_INSTRUCTIONSMODE",
  CANCELMODE: "_CANCELMODE"
};


const newSessionhandlers = {
  'NewSession': function(){
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
};

const startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function(startMessage = CHOOSE_TYPE_MESSAGE){
    if(_checkMealTypePresence(this)){
      // Go directly to selecting a meal if mealtype was already present in the slots
      _setMealType(this);
    }else{
      this.emit(':ask', startMessage, REPROMPT_TYPE);
    }
  },
  'ChooseTypeIntent': function(){
    if(_checkMealTypePresence(this)){
      _setMealType(this);
    }else{
      this.emit(':ask', MEALTYPE_NOT_IN_LIST(_selectedMealType(this)), MEALTYPE_NOT_IN_LIST(_selectedMealType(this)));
    }
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
});

const recipeModeHandlers = Alexa.CreateStateHandler(states.RECIPEMODE, {
  'Recipe': function(){
    if(this.new){
      this.attributes['remainingRecipes'] = recipes[this.handler.attributes['mealType']];
    }

    if(this.attributes['remainingRecipes'].length > 0){
      // Select random recipe and remove it form remainingRecipes
      this.attributes['recipe'] = this.attributes['remainingRecipes'].splice(_randomIndexOfArray(this.attributes['remainingRecipes']), 1)[0]; // Select a random recipe
      // Ask user to confirm selection
      this.emit(':ask', SUGGEST_RECIPE(this.attributes['recipe'].name), SUGGEST_RECIPE(this.attributes['recipe'].name));
    }else{
      this.attributes['remainingRecipes'] = recipes[this.attributes['mealType']];
      this.handler.state = states.CANCELMODE;
      this.emitWithState('NoRecipeLeftHandler');
    }
  },
  'IngredientsIntent': function(){
    var ingredients = this.attributes['recipe'].ingredients.join(', ').replace(/,(?!.*,)/gmi, ' and'); // Add 'and' before last ingredient

    this.emit(':ask', `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`, `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`)
  },
  'AMAZON.YesIntent': function(){
    this.attributes['instructions'] = this.attributes['recipe'].instructions;
    this.attributes['current_step'] = 0;
    this.handler.state = states.INSTRUCTIONSMODE;
    this.emitWithState('InstructionsIntent');
  },
  'AMAZON.NoIntent': function(){
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_RECIPE, HELP_RECIPE_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.handler.state = states.CANCELMODE;
    this.emitWithState('AskToCancelHandler');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

const instructionsModeHandlers = Alexa.CreateStateHandler(states.INSTRUCTIONSMODE, {
  'InstructionsIntent': function(){
    const firstTimeInstructions = (this.attributes['current_step'] === 0) ? FIRST_TIME_INSTRUCTIONS : '';
    this.emit(':ask', `${_getCurrentStep(this)} ${firstTimeInstructions}`, REPROMPT_INSTRUCTIONS);
  },
  'NextStepIntent': function(){
    this.attributes['current_step']++;

    if(this.attributes['current_step'] < this.attributes['instructions'].length - 1){
      this.emitWithState('InstructionsIntent');
    }else{
      this.emitWithState('InstructionsEnded');
    }
  },
  'InstructionsEnded': function(){
    this.emit(':tell', `${_getCurrentStep(this)} ${CLOSING_MESSAGE}`);
  },
  'DifferentRecipeIntent': function(){
    this.handler.state = states.RECIPEMODE;
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_INSTRUCTIONS, HELP_INSTRUCTIONS_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.handler.state = states.CANCELMODE;
    this.emitWithState('AskToCancelHandler');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER, MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
});


const cancelModeHandlers = Alexa.CreateStateHandler(states.CANCELMODE, {
  'NoRecipeLeftHandler': function(){
    this.emit(':ask', NO_REMAINING_RECIPE, NO_REMAINING_RECIPE);
  },
  'AskToCancelHandler': function(){
    this.emit(':ask', CANCEL_MESSAGE, CANCEL_MESSAGE);
  },
  'AMAZON.YesIntent': function(){
    this.attributes['current_step'] = 0;
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession', REPROMPT_TYPE);
  },
  'AMAZON.NoIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_CANCEL, HELP_CANCEL_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(newSessionhandlers, startModeHandlers, recipeModeHandlers, instructionsModeHandlers, cancelModeHandlers);
  alexa.execute();
};
