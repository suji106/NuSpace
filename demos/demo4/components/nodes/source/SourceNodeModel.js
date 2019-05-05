import _ from 'lodash';
import * as RJD from '../../../../../src/main';

export class SourceNodeModel extends RJD.NodeModel {
    constructor(name = 'Untitled', color = 'rgb(250, 250, 250)', settings = 'empty') {
        super('source');
        this.addPort(new RJD.DefaultPortModel(false, 'output', 'Out'));
        this.name = name;
        this.color = color;
        this.settings = settings;
    }

    deSerialize(object) {
        super.deSerialize(object);
        this.name = object.name;
        this.color = object.color;
        this.settings = object.settings;
    }

    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            color: this.color,
            settings: this.settings
        });
    }

    getOutPorts() {
        return _.filter(this.ports, portModel => !portModel.in);
    }
}
