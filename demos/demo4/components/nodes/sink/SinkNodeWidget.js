import React from 'react';
import * as RJD from '../../../../../src/main';
import {SinkNodeModel} from './SinkNodeModel';
import * as nodeColors from '../../../ColorConstants'
import ModalView from "../../../../../src/modal/ModalView";

export class SinkNodeWidget extends React.Component {

    constructor(props) {
        console.warn = console.error = () => {};
        super(props);

        this.state = {
            conf: this.props.node.settings
        };

        this.onRemove = this.onRemove.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
    }

    static defaultProps = {
        node: null,
        color: nodeColors.OUTPUT_NODE_COLOR
    };

    onRemove() {
        const {node, diagramEngine} = this.props;
        node.remove();
        diagramEngine.forceUpdate();
    }

    getInPorts() {
        const {node, color, displayOnly} = this.props;
        let inputNode = node;

        if (displayOnly) {
            inputNode = new SinkNodeModel(node.name, color, node.settings);
        }

        return inputNode.getInPorts ? inputNode.getInPorts().map((port, i) => (
            <RJD.DefaultPortLabel model={port} key={`in-port-${i}`}/>
        )) : [];
    }

    saveSettings(configs) {
        this.setState({conf: configs});
    }

    renderModal() {
        let configs_map = this.state.conf;

        return (
            <ModalView id={this.props.node.id} configs_map={configs_map} node={this.props.node} saveSettings={this.saveSettings} />
        );
    }

    render() {
        const {node, displayOnly, color: displayColor} = this.props;
        const {name, color} = node;

        const style = {};
        if (color || displayColor) {
            style.background = color || displayColor;
        }

        return (
            <div>
                {this.renderModal()}
                {!displayOnly ? <div className='fa fa-edit' onClick={ModalView.open(this.props.node.id)}/> : null}
                <div className='basic-node' style={style}>
                    <div className='title'>
                        <div className='name'>
                            {name}
                        </div>
                        {!displayOnly ? <div className='fa fa-close' onClick={this.onRemove}/> : null}
                    </div>

                    <div className='ports'>
                        <div className='in'>
                            {!displayOnly ? this.getInPorts() : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const OutputNodeWidgetFactory = React.createFactory(SinkNodeWidget);
