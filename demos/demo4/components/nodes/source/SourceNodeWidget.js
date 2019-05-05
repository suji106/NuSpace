import React from 'react';
import * as RJD from '../../../../../src/main';
import {SourceNodeModel} from "./SourceNodeModel";
import * as nodeColors from '../../../ColorConstants'
import ModalView from "../../../../../src/modal/ModalView";
import 'react-bootstrap';

export class SourceNodeWidget extends React.Component {

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
        color: nodeColors.INPUT_NODE_COLOR
    };

    onRemove() {
        const {node, diagramEngine} = this.props;
        node.remove();
        diagramEngine.forceUpdate();
    }

    getOutPorts() {
        const {node, color, displayOnly} = this.props;
        let outputNode = node;

        if (displayOnly) {
            outputNode = new SourceNodeModel(node.name, color, node.settings);
        }

        return outputNode.getOutPorts ? outputNode.getOutPorts().map((port, i) => (
            <RJD.DefaultPortLabel model={port} key={`out-port-${i}`}/>
        )) : null;
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
                        <div className='out'>
                            {!displayOnly ? this.getOutPorts() : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export const InputNodeWidgetFactory = React.createFactory(SourceNodeWidget);
