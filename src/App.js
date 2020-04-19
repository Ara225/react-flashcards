import React from 'react';
import * as yaml from 'js-yaml';
import Popup from "reactjs-popup";
import FlashCardPopup from './FlashCardPopup';
import './UploadButtonStyling.css'

/**
 * Render the main body of the page
 */
class FlashCardApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {items: [], text: null };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.handleFileLoad = this.handleFileLoad.bind(this);
    }

    render() {
        return (
            <div class="container col-7" style={{"padding-top": "10%"}}>
                <div class="rounded" style={{"backgroundColor": "white", "padding": "5%"}}>
                    <h4 class="text-center">Add Flashcards from File</h4>
                    <div class="text-center">
                        <div class="fileUpload btn btn-info">
                            <span>Load from Yaml File</span>
                            <input id="uploadBtn" type="file" class="upload" onChange={this.handleFileSelect}/>
                        </div>
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
                    <h4 class="text-center">Add Flashcards Manually</h4>
                    <form onSubmit={this.handleSubmit} class="form-group">
                        <input class="form-control" id="new-flashcard-front" placeholder="Front of Flash Card" />
                        <br />
                        <input class="form-control" id="new-flashcard-back" placeholder="Back of Flash Card" />
                        <br />
                        <button class="btn btn-info">
                            Add Flash Card
                        </button>
                    </form>
                    <br/>
                    <Popup
                      trigger={<button className="btn-success form-control" id="popupButton"> View Loaded Flashcards </button>}
                      modal
                      closeOnDocumentClick
                    >
                        <FlashCardPopup items={this.state.items} />
                    </Popup>
                </div>
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
            alert("Success: Yaml file loaded ")
            document.getElementById("popupButton").click()
        }
        catch(e) {
            alert('Error: Unable to process the yaml file, see the Yaml File Format')
        }
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

export default FlashCardApp;