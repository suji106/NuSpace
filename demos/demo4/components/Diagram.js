import React from 'react';
import _ from 'lodash';
import {DropTarget} from 'react-dnd';
import * as RJD from '../../../src/main';
import {SinkNodeModel} from './nodes/sink/SinkNodeModel';
import {SourceNodeModel} from './nodes/source/SourceNodeModel';
import {ProcessorNodeModel} from './nodes/processor/ProcessorNodeModel';
import {diagramEngine} from './Engine';

// Setup the diagram model
let diagramModel = new RJD.DiagramModel();

const nodesTarget = {
    drop(props, monitor, component) {
        const {x: pageX, y: pageY} = monitor.getSourceClientOffset();
        const {left = 0, top = 0} = diagramEngine.canvas.getBoundingClientRect();
        const {offsetX, offsetY} = diagramEngine.diagramModel;
        const x = pageX - left - offsetX;
        const y = pageY - top - offsetY;
        const item = monitor.getItem();

        let node;
        if (item.type === 'sink') {
            node = new SinkNodeModel(item.name, item.color, item.settings);
        }
        if (item.type === 'source') {
            node = new SourceNodeModel(item.name, item.color, item.settings);
        }
        if (item.type === 'processor') {
            node = new ProcessorNodeModel(item.name, item.color, item.settings);
        }

        node.x = x;
        node.y = y;
        diagramModel.addNode(node);
        props.updateModel(diagramModel.serializeDiagram());
    },
};

@DropTarget('node-source', nodesTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))
export class Diagram extends React.Component {
    componentDidMount() {
        const {model} = this.props;
        if (model) {
            this.setModel(model);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.model, nextProps.model)) {
            this.setModel(nextProps.model, nextProps.nodesPanel);
        }
    }

    setModel(model, nodesPanel) {
        diagramModel = new RJD.DiagramModel();
        if (model) {
            diagramModel.deSerializeDiagram(model, diagramEngine, nodesPanel);
        }
        diagramEngine.setDiagramModel(diagramModel);
    }

    onChange(model, action) {
        // console.log('ON DIAGRAM CHANGE');
        // console.log(action);

        // Ignore some events
        if (['items-copied'].indexOf(action.type) !== -1) {
            return;
        }

        // Check for single selected items
        if (['node-selected', 'node-moved'].indexOf(action.type) !== -1) {
            return this.props.updateModel(model, {selectedNode: action.model});
        }

        // if (['link-selected', 'link-moved'].indexOf(action.type) !== -1) {
        //     return this.props.updateModel(model, {selectedLink: action.model});
        // }

        // Check for canvas events
        const deselectEvts = ['canvas-click', 'canvas-drag', 'items-selected', 'items-drag-selected', 'items-moved'];
        if (deselectEvts.indexOf(action.type) !== -1) {
            return this.props.updateModel(model, {selectedNode: null});
        }

        // Check if this is a deselection and a single node exists
        const isDeselect = ['node-deselected', 'link-deselected'].indexOf(action.type) !== -1;
        if (isDeselect && action.items.length < 1 && action.model.nodeType) {
            return this.props.updateModel(model, {selectedNode: action.model});
        }

        this.props.updateModel(model);
    }

    render() {
        const {connectDropTarget} = this.props;

        // Render the canvas
        return connectDropTarget(
            <div className='diagram-drop-container'>
                <RJD.DiagramWidget diagramEngine={diagramEngine} onChange={this.onChange.bind(this)}/>
            </div>
        );
    }
}
