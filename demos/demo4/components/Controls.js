import React from 'react';
import {DiagramModel} from "../../../src/DiagramModel";

export class Controls extends React.Component {
    render() {
        const {diagramModel, updateModel, selectedNode, onUndo, onRedo, canUndo, canRedo} = this.props;
        const content = diagramModel ? JSON.stringify(diagramModel.serializeDiagram(), null, 2) : '';
        return (
            <div className='controls'>
                <div>
                    {/*<button onClick={onUndo} disabled={!canUndo}>Undo</button>*/}
                    {/*<button onClick={onRedo} disabled={!canRedo}>Redo</button>*/}
                </div>
                <pre>
                  {content}
                </pre>
            </div>
        );
    }
}
