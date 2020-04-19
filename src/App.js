import React from 'react';
import * as yaml from 'js-yaml';

/**
 * Render the main body of the page
 */
class FlashCardApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [], showBack: false, currentItem: 0, text: null,
            style: { "paddingTop": "15%", "paddingBottom": "15%", "paddingLeft": "15%", "paddingRight": "15%", "fontSize": "20px" }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.flip = this.flip.bind(this);
        this.getNew = this.getNew.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.handleFileLoad = this.handleFileLoad.bind(this);
    }

    render() {
        return (
            <div class="container col-6">
                <br />
                <br />
                <FlashCardContainer items={this.state.items} showBack={this.state.showBack} currentItem={this.state.currentItem}
                    style={this.state.style} />
                <div class="text-center form-group">
                    <br />
                    <button class="btn btn-primary" onClick={this.flip}>
                        Flip Flash Card
                    </button>
                    &nbsp; &nbsp;
                    <button class="btn btn-info" onClick={this.getNew}>
                        Another Flash Card
                    </button>
                </div>
                <br />
                <h4 class="text-center">Add New Flashcards from a Yaml File</h4>
                <div class="text-center">
                    <input type="file" name="file" onChange={this.handleFileSelect} />
                    &nbsp; &nbsp;
                    <button class="btn" onClick={function () {
                        alert('The required format of submitted yaml files is:\n\n ' +
                            'SectionName:\n    Weight: 2\n    Description: blah blah\n    Key Knowledge Areas:\n        - Blah Blah\n    Examples:\n' +
                            '        - / (root) filesystem\n    Questions:\n        Prompts:\n            - / (root) filesystem\n        Answers:\n            ' +
                            '- / (root) filesystem\n\nNotes:\nMultiple top level keys are supported but they\'re all lumped together, only the Questions key and ' +
                            'it\'s Prompts/Answers keys are needed under each\n')
                        }}>
                        Yaml File Format
                    </button>
                </div>
                <br />
                <h4 class="text-center">Add New Flashcards Manually</h4>
                <form onSubmit={this.handleSubmit} class="form-group">
                    <input class="form-control" id="new-flashcard-front" placeholder="Front of Flash Card" />
                    <br />
                    <input class="form-control" id="new-flashcard-back" placeholder="Back of Flash Card" />
                    <br />
                    <button class="btn btn-success">
                        Add Flash Card
                    </button>
                </form>
            </div>
        );
    }

    /**
     * Handle when a file is selected
     * @param {Event} event Triggering event
     */
    handleFileSelect(event) {
        // If not a yaml file
        if (!event.target.files[0].name.includes("yaml") && !event.target.files[0].name.includes("yml")) {
            alert("Please submit a valid yaml file")
            return
        }
        var reader = new FileReader();

        // file reading started
        reader.addEventListener('loadstart', function () {
            console.log('File reading started');
        });

        // file reading finished successfully
        reader.addEventListener('load', e => this.handleFileLoad(e));
        // file reading failed
        reader.addEventListener('error', function () {
            alert('Error : Failed to read file');
        });

        reader.readAsText(event.target.files[0]);
    }

    /**
     * Parse the yaml file after it's been loaded into memory
     * @param {Event} event Triggering event
     */
    handleFileLoad(event) {
        try {
            var item = []
            this.setState({ text: yaml.safeLoad(event.target.result) });
            // Ugly for/if section 
            for (var key of Object.keys(this.state.text)) {
                for (var key2 of Object.keys(this.state.text[key])) {
                    if (!key2.match('Weight') && !key2.match('Description') && !key2.match('KeyKnowledgeAreas') && !key2.match('Examples') && !key2.match('Key Knowledge Areas')) {
                        for (var i = 0; i < this.state.text[key][key2]['Prompts'].length; i++) {
                            item.push({
                                front: this.state.text[key][key2]['Prompts'][i],
                                back: this.state.text[key][key2]['Answers'][i],
                                id: Date.now()
                            });
                        }
                    }
                }
            }
            this.setState(state => ({
                items: state.items.concat(item),
            }));
        }
        catch(e) {
            alert('Error: Unable to process the yaml file, see the Yaml File Format')
        }
    }

    /**
     * Get a new random flash card not the same as the previous one
     */
    getNew() {
        if (this.state.items.length > 1) {
            this.setState({ showBack: false });
            var randomChoice = Math.floor(Math.random() * this.state.items.length)
            while (randomChoice === this.state.currentItem) {
                randomChoice = Math.floor(Math.random() * this.state.items.length)
            }
            this.setState({ currentItem: randomChoice });
            this.randomColour()
        }
    }

    /**
     * Flip the flash card 
     */
    flip() {
        console.log(this.state.showBack)
        if (this.state.showBack && this.state.items.length > 0) {
            this.setState({ showBack: false });
            document.getElementById("flashCardContainer").value = this.state.items[this.state.currentItem].front
        }
        else if (!this.state.showBack && this.state.items.length > 0) {
            this.setState({ showBack: true });
            document.getElementById("flashCardContainer").value = this.state.items[this.state.currentItem].back
        }
    }

    /**
     * Set the background color of the flashCard Container randomly
     */
    randomColour() {
        var colors = ['AliceBlue', 'Beige', 'Bisque', 'AntiqueWhite', 'BurlyWood', 'Cornsilk', 'Gainsboro', 'LightSteelBlue', 'Moccasin', 'Thistle']
        var color = colors[Math.floor(Math.random() * colors.length)];
        document.getElementById('flashCardContainer').style.background = color;
    }

    /**
     * Handle submit of the manual flash card form
     * 
     * @param {Event} event Triggering event object
     */
    handleSubmit(event) {
        event.preventDefault();
        // If both fields are empty
        if (document.getElementById("new-flashcard-front").value.length === 0 || document.getElementById("new-flashcard-back").value.length === 0) {
            alert("Please complete both fields")
            return;
        }
        // Change background color of the flash card container randomly
        this.randomColour()
        // Set random current item
        this.setState({ currentItem: Math.floor(Math.random() * this.state.items.length) });
        // Generate new object containing value of both fields
        const newItem = {
            front: document.getElementById("new-flashcard-front").value,
            back: document.getElementById("new-flashcard-back").value,
            id: Date.now()
        };
        // Clear form values
        document.getElementById("new-flashcard-front").value = ""
        document.getElementById("new-flashcard-back").value = ""
        this.setState(state => ({
            items: state.items.concat(newItem),
        }));
    }
}

/**
 * Render the flash card container
 */
class FlashCardContainer extends React.Component {
    render() {
        if (this.props.items.length > 0) {

            if (this.props.showBack === false) {
                return (
                    <textarea className="form-control text-center" id="flashCardContainer"
                        value={this.props.items[this.props.currentItem].front} style={this.props.style} disabled>
                    </textarea>
                );
            }
            else if (this.props.showBack === true) {
                return (
                    <textarea className="form-control text-center" id="flashCardContainer"
                        value={this.props.items[this.props.currentItem].back} style={this.props.style} disabled>
                    </textarea>

                );
            }
        }
        else {
            return (
                <textarea className="form-control text-center" id="flashCardContainer" style={this.props.style} disabled>
                </textarea>

            );
        }
    }

}

export default FlashCardApp;