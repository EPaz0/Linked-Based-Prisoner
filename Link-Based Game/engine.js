class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {
        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.inventory = new Inventory(); // Initialize inventory management

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));

        fetch(storyDataUrl)
            .then(response => response.json())
            .then(json => {
                this.storyData = json;
                this.gotoScene(firstSceneClass);
            })
            .catch(error => {
                console.error("Failed to load story data:", error);
                this.show("Error loading game data. Please refresh the page to try again.");
            });
    }

    gotoScene(sceneClass, data) {
        if (this.scene && this.scene.cleanup) {
            this.scene.cleanup();  // Optional: Clean up the current scene if needed
        }
        this.scene = new sceneClass(this);
        this.scene.create(data);
    }

    addChoice(text, action) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = text;
        button.onclick = () => {
            this.clearActions();
            action();
        }
    }

    clearActions() {
        while (this.actionsContainer.firstChild) {
            this.actionsContainer.removeChild(this.actionsContainer.firstChild);
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }
}

class Inventory {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    hasItem(item) {
        return this.items.includes(item);
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('No choice handler on scene ', this);
    }


}