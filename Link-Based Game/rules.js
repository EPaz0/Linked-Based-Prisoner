class Start extends Scene {
    create() {
        // Set the title from the story data
        this.engine.setTitle(this.engine.storyData.Title);
        // Add a button to begin the story
        this.engine.addChoice("Begin the story", () => {
            this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
        });
    }
}

class Location extends Scene {
    create(key) {
        // Retrieve the location data from the story JSON
        let locationData = this.engine.storyData.Locations[key];
        // Display the body text of the location
        this.engine.show(locationData.Body);


        if (locationData.items) {
            locationData.items.forEach(item => {
                this.engine.addChoice(` ${item.description}`, () => this.handleItemPickup(item, key));
            });
        }


        // Handle interactions if present
        if (locationData.interactions) {
            locationData.interactions.forEach(interaction => {
                // Add interaction choices based on the state
                if (interaction.type === "radio") {
                    if (interaction.initialState === "off") {
                        this.engine.addChoice("Turn on the radio", () => this.handleRadioInteraction(interaction));
                    } else {
                        this.engine.addChoice("Listen to the radio again", () => this.repeatRadioMessage(interaction));
                    }

                } else if(interaction.type === "food"){
                    this.engine.addChoice(interaction.description, () => this.handleFoodConsumption(interaction, key));
                    

                } {
                   // this.engine.addChoice(interaction.description, () => this.handleInteraction(interaction));
                }
            });
        }

        // Add choices for moving or other actions
        this.addChoices(locationData);
    }
    handleItemPickup(item, locationKey) {
        if (!this.engine.inventory.hasItem(item.id)) {
            this.engine.inventory.addItem(item.id);
            this.engine.show(`You picked up ${item.description}.`);

            this.engine.addChoice("Continue to guard room", () => this.engine.gotoScene(Location, locationKey));
        } else {
            this.engine.show(`You already have the ${item.description}.`);
            // Provide an option to continue exploring even if the item is already picked
            this.engine.addChoice("Continue to guard room", () => this.engine.gotoScene(Location, locationKey));
        }
    }

    handleFoodConsumption(interaction, locationKey) {
        this.engine.show(interaction.effect.consume.message);
        // After showing the message, provide options to continue
        this.engine.addChoice("Continue", () => this.engine.gotoScene(Location, locationKey));
    }
    handleRadioInteraction(interaction) {
        if (interaction.initialState === "off") {
            interaction.initialState = "on";  // Change the state to on
            const messages = interaction.states.on.messages;
            const message = messages[Math.floor(Math.random() * messages.length)]; // Randomly select a message
            this.engine.show(message);
            // After showing the message, provide a choice to go back
            this.engine.addChoice("Back away", () => this.engine.gotoScene(Location, "Guard Room"));
        }
    }

    repeatRadioMessage(interaction) {
        // Simply repeat the last message shown or choose a default one
        const messages = interaction.states.on.messages;
        const message = messages[0]; // Repeat the first message or a neutral message
        this.engine.show(message);
        // Provide a choice to go back
        this.engine.addChoice("Back away", () => this.engine.gotoScene(Location, "Guard Room"));
    }

    addChoices(locationData) {
        locationData.Choices.forEach(choice => {
            if (choice.requiredItem) {
                this.engine.addChoice(choice.Text, () => this.handleConditionalChoice(choice));
            } else {
                this.engine.addChoice(choice.Text, () => this.engine.gotoScene(Location, choice.Target));
            }
        });
    }

    handleConditionalChoice(choice) {
        if (this.engine.inventory.hasItem(choice.requiredItem)) {
            this.engine.show(choice.successText);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.show(choice.failText);
            this.engine.addChoice("Back away", () => this.engine.gotoScene(Location, "Guard Room"));
        }
    }
}
class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');