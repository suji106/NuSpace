import React from 'react';
import * as RJD from '../../../../../src/main';
import {ProcessorNodeModel} from './ProcessorNodeModel';
import * as nodeColors from '../../../ColorConstants'
import ModalView from "../../../../../src/modal/ModalView";

export class ProcessorNodeWidget extends React.Component {

    constructor(props) {
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
        color: nodeColors.CONNECTION_NODE_COLOR
    };

    onRemove() {
        const {node, diagramEngine} = this.props;
        node.remove();
        diagramEngine.forceUpdate();
    }

    getInPort() {
        const {node, color, displayOnly} = this.props;
        let inputNode = node;

        if (displayOnly) {
            inputNode = new ProcessorNodeModel(node.name, color);
        }

        return inputNode.getInPort ? <RJD.DefaultPortLabel model={inputNode.getInPort()} key='in-port'/> : null;
    }

    getOutPort() {
        const {node, color, displayOnly} = this.props;
        let outputNode = node;

        if (displayOnly) {
            outputNode = new ProcessorNodeModel(node.name, color);
        }

        return outputNode.getOutPort ? <RJD.DefaultPortLabel model={outputNode.getOutPort()} key='out-port'/> : null;
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
                            {!displayOnly ? this.getInPort() : null}
                        </div>
                        <div className='out'>
                            {!displayOnly ? this.getOutPort() : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const ConnectionNodeWidgetFactory = React.createFactory(ProcessorNodeWidget);
