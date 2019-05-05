import React from 'react';
import {DragWrapper} from './DragWrapper';
import {SinkNodeWidget} from './nodes/sink/SinkNodeWidget';
import {SourceNodeWidget} from "./nodes/source/SourceNodeWidget";
import {ProcessorNodeWidget} from "./nodes/processor/ProcessorNodeWidget";
import * as nodeColors from '../ColorConstants'

class Node extends React.Component {
    renderNode() {
        const {type, color, name} = this.props;

        if (type === 'sink') {
            return <SinkNodeWidget node={{name: name}} displayOnly/>;
        }
        if (type === 'source') {
            return <SourceNodeWidget node={{name: name}} displayOnly/>;
        }
        if (type === 'processor') {
            return <ProcessorNodeWidget node={{name: name}} displayOnly/>;
        }

        // console.warn('Unknown node type');
        return null;
    }

    render() {
        const {name, type, color, settings} = this.props;
        return (
            <DragWrapper name={name} type={type} color={color} settings={settings} style={{display: 'inline-block'}}>
                {this.renderNode()}
            </DragWrapper>
        );
    }
}

export class NodesPanel extends React.Component {

    constructor(props) {
        super(props);
        this.color = '';

        this.state = {
            input: {
                "maxCount": {},
                "Sources": [],
                "Processors": [],
                "Sinks": []
            }
        };

        let input_url = 'https://floater-java.herokuapp.com/api/input';

        fetch(input_url)
            .then(response => response.json())
            .then(input => {
                this.setState({input: input.flow});
            });

        this.setColor = this.setColor.bind(this);
        this.renderGroupDetails = this.renderGroupDetails.bind(this);
    }

    static panelObject = {
        "maxCount": {
            "sink": 1,
            "source": 3,
            "processor": 3
        },
        "Sources": [{
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": "b"
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": "p"
                }
            },
            "name": "Sftp",
            "type": "source"
        }, {
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": ""
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": ""
                }
            },
            "name": "Ftp",
            "type": "source"
        }, {
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": ""
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": ""
                }
            },
            "name": "Jms",
            "type": "source"
        }],
        "Processors": [{
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": "b"
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": "p"
                }
            },
            "name": "Splitter",
            "type": "processor"
        }, {
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": ""
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": ""
                }
            },
            "name": "Transformer",
            "type": "processor"
        }, {
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": ""
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": ""
                }
            },
            "name": "Parser",
            "type": "processor"
        }, {
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": ""
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": ""
                }
            },
            "name": "Formatter",
            "type": "processor"
        }],
        "Sinks": [{
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": "b"
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": "p"
                }
            },
            "name": "Sftp",
            "type": "sink"
        }, {
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": ""
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": ""
                }
            },
            "name": "Ftp",
            "type": "sink"
        }, {
            "settings": {
                "abc": {
                    "options": ["a", "b", "c"],
                    "selected": ""
                },
                "inputs": {
                    "zzz": "",
                    "lll": ""
                },
                "xyz": {
                    "options": ["p", "q", "r"],
                    "selected": ""
                }
            },
            "name": "Jms",
            "type": "sink"
        }]
    };

    // static panelObject = {
    //     "maxCount": {},
    //     "Sources": [],
    //     "Processors": [],
    //     "Sinks": []
    // };

    static getPanelObject() {
        return NodesPanel.panelObject;
    }

    setColor(type) {
        if (type === 'sink')
            return this.color = nodeColors.OUTPUT_NODE_COLOR;
        if (type === 'source')
            return this.color = nodeColors.INPUT_NODE_COLOR;
        if (type === 'processor')
            return this.color = nodeColors.CONNECTION_NODE_COLOR;
    }

    renderGroupDetails(sub) {
        return (
            <div>
                {
                    sub.map((sub, sub_key) => (
                        <div className="node-gap" key={sub_key}>
                            <Node type={sub.type} color={sub.color ||
                            this.setColor(sub.type)} name={sub.name}
                                  settings={sub.settings}/>
                        </div>
                    ))
                }
            </div>
        );
    }

    render() {
        let pan =
            '{\n' +
            '"maxCount":{"sink":1,"source":3,"processor":3},\n' +
            '\n' +
            '"Sources":\n' +
            '[{"settings":{"abc":{"options":["a","b","c"],"selected":"b"},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":"p"}},"name":"Sftp","type":"source"},{"settings":{"abc":{"options":["a","b","c"],"selected":""},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":""}},"name":"Ftp","type":"source"},{"settings":{"abc":{"options":["a","b","c"],"selected":""},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":""}},"name":"Jms","type":"source"}\n' +
            '],\n' +
            '\n' +
            '"Processors":\n' +
            '[{"settings":{"abc":{"options":["a","b","c"],"selected":"b"},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":"p"}},"name":"Splitter","type":"processor"},{"settings":{"abc":{"options":["a","b","c"],"selected":""},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":""}},"name":"Transformer","type":"processor"},{"settings":{"abc":{"options":["a","b","c"],"selected":""},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":""}},"name":"Parser","type":"processor"},{"settings":{"abc":{"options":["a","b","c"],"selected":""},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":""}},"name":"Formatter","type":"processor"}\n' +
            '],\n' +
            '\n' +
            '"Sinks":[{"settings":{"abc":{"options":["a","b","c"],"selected":"b"},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":"p"}},"name":"Sftp","type":"sink"},{"settings":{"abc":{"options":["a","b","c"],"selected":""},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":""}},"name":"Ftp","type":"sink"},{"settings":{"abc":{"options":["a","b","c"],"selected":""},"inputs":{"zzz":"","lll":""},"xyz":{"options":["p","q","r"],"selected":""}},"name":"Jms","type":"sink"}\n' +
            ']\n' +
            '}';

        pan = JSON.parse(pan);
        NodesPanel.panelObject = pan;

        let newObj = {};

        for (let i in NodesPanel.panelObject) {
            if (i !== 'maxCount') {
                newObj[i] = NodesPanel.panelObject[i];
            }
        }

        // make this 100 if the title block is removed
        let TITLE_BLOCK_HEIGHT = 100;

        let height = (window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight) - TITLE_BLOCK_HEIGHT;

        return (
            <div style={{height: height}} className='nodes-panel'>
                <div>
                    {Object.keys(newObj).map((group, key) => (
                        <div className="col-3" key={key}>
                            <div className="node-header">
                                {group}
                            </div>
                            {this.renderGroupDetails(NodesPanel.panelObject[group])}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
