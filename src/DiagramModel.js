import _ from 'lodash';
import {LinkModel, NodeModel} from './Common';
import {BaseEntity} from './BaseEntity';

export class DiagramModel extends BaseEntity {
    constructor() {
        super();
        this.title = '';
        this.clientId = '';
        this.links = {};
        this.nodes = {};
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 100;
        this.rendered = false;
    }

    static checkEmptinessOfNodes(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let ports = node.ports;
            for (let l = 0; l < ports.length; l ++) {
                let port = ports[l];
                if (port.links.length === 0) {
                    return alert(port.name + " port of " + node.name + ' is not connected to any node');
                }
            }
        }
        return true;
    }

    deSerializeDiagram(object, diagramEngine) {
        this.deSerialize(object);
        this.title = object.title;
        // this.clientId = object.client;
        this.offsetX = object.offsetX;
        this.offsetY = object.offsetY;
        this.zoom = object.zoom;

        // Deserialize nodes
        _.forEach(object.nodes, node => {
            const nodeOb = diagramEngine.getInstanceFactory(node._class).getInstance();
            nodeOb.deSerialize(node);

            // Deserialize ports
            _.forEach(node.ports, port => {
                const portOb = diagramEngine.getInstanceFactory(port._class).getInstance();
                portOb.deSerialize(port);
                nodeOb.addPort(portOb);
            });

            let nodes = this.getNodes();
            let nodesCount = 0;
            for (let i in nodes) {
                let node = nodes[i];
                if (node.nodeType === nodeOb.nodeType) {
                    nodesCount = nodesCount + 1;
                }
            }
            var {NodesPanel} = require('../demos/demo4/components/NodesPanel');
            if (nodesCount < NodesPanel.getPanelObject().maxCount[nodeOb.nodeType]) {
                this.addNode(nodeOb);
            }
            else {
                alert('Exceeded max number of ' + nodeOb.nodeType + ' type nodes');
            }
        });

        // Attach ports
        _.forEach(object.links, link => {
            const linkOb = diagramEngine.getInstanceFactory(link._class).getInstance();
            linkOb.deSerialize(link);

            if (link.target) {
                let targetPort = this.getNode(link.target).getPortFromID(link.targetPort);
                let links = targetPort.links;
                let noOfTargetLinks = Object.keys(links).length;

                // to have only one link on the input port. Also disabling output port as target
                if ((noOfTargetLinks > -1) && (targetPort.name === 'input')) {

                    linkOb.setTargetPort(this.getNode(link.target).getPortFromID(link.targetPort));
                    if (link.source) {
                        linkOb.setSourcePort(this.getNode(link.source).getPortFromID(link.sourcePort));
                    }
                    this.addLink(linkOb);
                }
            }
        });
    }

    serializeDiagram() {
        return {
            ...this.serialize(),
            title: this.title,
            clientId: this.clientId,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            zoom: this.zoom,
            links: _.map(this.links, link => link.serialize()),
            nodes: _.map(this.nodes, link => link.serialize())
        };
    }

    clearSelection(ignore, supressListener) {
        _.forEach(this.getSelectedItems(), element => {
            if (ignore && ignore.getID() === element.getID()) {
                return;
            }
            element.setSelected(false); //TODO dont fire the listener
        });
        if (supressListener) {
            return;
        }
        this.itterateListeners(listener => {
            if (listener.selectionCleared) {
                listener.selectionCleared();
            }
        });
    }

    getSelectedItems() {
        return [
            // Nodes
            ..._.filter(this.nodes, node => node.isSelected()),
            // Points
            ..._.filter(_.flatMap(this.links, node => node.points), port => port.isSelected()),
            // Links
            ..._.filter(this.links, link => link.isSelected())
        ];
    }

    setZoomLevel(zoom) {
        this.zoom = zoom;
        this.itterateListeners(listener => {
            if (listener.controlsUpdated) {
                listener.controlsUpdated();
            }
        });
    }

    setOffset(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.itterateListeners(listener => {
            if (listener.controlsUpdated) {
                listener.controlsUpdated();
            }
        });
    }

    setOffsetX(offsetX) {
        this.offsetX = offsetX;
        this.itterateListeners(listener => {
            if (listener.controlsUpdated) {
                listener.controlsUpdated();
            }
        });
    }

    setOffsetY(offsetY) {
        this.offsetX = offsetY;
        this.itterateListeners(listener => {
            if (listener.controlsUpdated) {
                listener.controlsUpdated();
            }
        });
    }

    getOffsetY() {
        return this.offsetY;
    }

    getOffsetX() {
        return this.offsetX;
    }

    getZoomLevel() {
        return this.zoom;
    }

    getNode(node) {
        if (node instanceof NodeModel) {
            return node;
        }
        if (!this.nodes[node]) {
            return null;
        }
        return this.nodes[node];
    }

    getLink(link) {
        if (link instanceof LinkModel) {
            return link;
        }
        if (!this.links[link]) {
            return null;
        }
        return this.links[link];
    }

    addLink(link) {
        link.addListener({
            entityRemoved: () => {
                this.removeLink(link);
            }
        });
        this.links[link.getID()] = link;
        this.itterateListeners(listener => {
            if (listener.linksUpdated) {
                listener.linksUpdated();
            }
        });
        return link;
    }

    addNode(node) {
        node.addListener({
            entityRemoved: () => {
                this.removeNode(node);
            }
        });
        this.nodes[node.getID()] = node;
        this.itterateListeners(listener => {
            if (listener.nodesUpdated) {
                listener.nodesUpdated();
            }
        });
        return node;
    }

    removeLink(link) {
        if (link instanceof LinkModel) {
            delete this.links[link.getID()];
            this.itterateListeners(listener => {
                if (listener.linksUpdated) {
                    listener.linksUpdated();
                }
            });
            return;
        }
        delete this.links[_.toString(link)];
        this.itterateListeners(listener => {
            if (listener.linksUpdated) {
                listener.linksUpdated();
            }
        });
    }

    removeNode(node) {
        if (node instanceof NodeModel) {
            delete this.nodes[node.getID()];
            this.itterateListeners(listener => {
                if (listener.nodesUpdated) {
                    listener.nodesUpdated();
                }
            });
            return;
        }

        delete this.nodes[_.toString(node)];
        this.itterateListeners(listener => {
            if (listener.nodesUpdated) {
                listener.nodesUpdated();
            }
        });
    }

    nodeSelected(node) {
        this.itterateListeners(listener => {
            if (listener.selectionChanged) {
                listener.selectionChanged(node);
            }
        });
    }

    getLinks() {
        return this.links;
    }

    getNodes() {
        return this.nodes;
    }
}
