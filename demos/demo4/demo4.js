import React from 'react';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {connect} from 'react-redux';
import * as actions from './actions';
import {NodesPanel} from './components/NodesPanel';
import {Diagram} from './components/Diagram';
import * as RJD from "../../src/main";
import {diagramEngine} from "./components/Engine";
import {Button} from 'react-bootstrap';
import {Controls} from "./components/Controls";
import {DiagramModel} from "../../src/main";
import './demo4.scss';

class Demo extends React.Component {

    constructor() {
        super();
        this.homeState = {
            mode: 'index',
            title: '',
            currentAgenda: '',
            agendas: ['Execute a workflow', 'Create/Update a workflow'],
            diagramValue: ''
        };
        this.state = this.homeState;
        this.diagramTitles = [];
        this.show = false;

        let titles = 'https://floater-java.herokuapp.com/api/titles';
        fetch(titles)
            .then(response => {setTimeout(() => null, 0); return response.json()})
            .then(input => {this.diagramTitles = input});

        this.showIndexPage = this.showIndexPage.bind(this);
        this.showWorkflowPage = this.showWorkflowPage.bind(this);
        this.getCurrentDiagram = this.getCurrentDiagram.bind(this);
        this.getStarterDiagramHeader = this.getStarterDiagramHeader.bind(this);
        this.getCurrentAgenda = this.getCurrentAgenda.bind(this);
        this.getDiagramEngine = this.getDiagramEngine.bind(this);
        this.saveWorkFlow = this.saveWorkFlow.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.setWorkflow = this.setWorkflow.bind(this);
        this.getHomeState = this.getHomeState.bind(this);
        this.getZoom = this.getZoom.bind(this);
    }

    getHomeState() {
        if (this.state.currentAgenda !== '') {
            if (window.confirm("Are you sure to navigate to home page of ID?")) {
                // this.show = false;
                // return (this.setState(this.homeState));
                window.location.reload();
            }
        }
    }

    getHeader() {
        return (
            <div className="workflow-header">
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <p className="statestr-header" onClick={() => this.getHomeState()}>
                                {/*<span className="statestr-s-header">*/}
                                    {/*S*/}
                                {/*</span>*/}
                                {/*TATE*/}
                                {/*<span className="statestr-s-header">*/}
                                    {/*S*/}
                                {/*</span>*/}
                                {/*TREET*/}
                            </p>
                        </td>
                        <td>
                            <p className="workflow-w-header" onClick={() => this.getHomeState()}>
                                Floater
                            </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    getCurrentAgenda() {
        return (
            <div className="header-select-toolbars">
                <select className="select-diagram-agenda" onChange={(e) => {
                    this.setState({currentAgenda: e.target.value})
                }}>
                    <option value="" className="select-diagram-option">
                        Select an agenda to continue...
                    </option>
                    {
                        this.state.agendas.map((title, key) => (
                                <option className="select-diagram-option" key={key}>
                                    {title}
                                </option>
                            )
                        )
                    }
                </select>
            </div>
        );
    }

    getStarterDiagramHeader(model) {
        return (
            <div className="header-select-toolbars">
                <div className="title-div">
                    <span className="letter-spacing">
                        Workflow Title:
                    </span>
                    <span className="italic-and-black">
                        {this.state.title}
                    </span>
                    <Button className="push-right button-generic" onClick={() => {
                        this.saveWorkFlow(model)
                    }}>
                        Save Workflow</Button>
                    <Button className="button-generic" onClick={() => {
                        this.show = !this.show;
                    }}>
                        Show Workflow Object</Button>
                </div>
            </div>
        );
    }

    setWorkflow() {
        let title_url = 'https://floater-java.herokuapp.com/api/title/' + String(this.state.diagramValue);
        fetch(title_url)
            .then(response => {setTimeout(() => null, 0); return response.json()})
            .then(input => {this.setState({workflow: JSON.parse(input.flow)})});
    }

    getCurrentDiagram() {
        let model = this.props.model;
        if (model !== null) {
            this.getZoom() !== null ?  (model.zoom = this.getZoom()): null;
            return model;
        }

        if (String(this.state.currentAgenda) === 'update' && this.state.diagramValue !== '') {
            return this.state.workflow;
        }

        return model;
    }

    getDiagramEngine(model) {
        let diagramModel = new RJD.DiagramModel();
        if (model) {
            // diagramModel.deSerializeDiagram(model, diagramEngine);
        }
        diagramEngine.getDiagramModel(diagramModel);
        return diagramEngine;
    }

    saveWorkFlow(object) {
        this.setState({alert: true});
        const content = object ?
            JSON.stringify(object.serializeDiagram(), null, 2)
            :
            '';

        let nodes = JSON.parse(content).nodes;
        let status = DiagramModel.checkEmptinessOfNodes(nodes);
        console.log(status);
        if (status) {
            console.log(status);
            let output_url = 'https://floater-java.herokuapp.com/api/title';

            fetch(output_url,
                {
                    body: JSON.stringify(JSON.parse(content)),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                    credentials: 'include'
                }
            ).then(response => {
                if (String(response.status) === '200') {
                    alert("Save Successful");
                }
                else {
                    alert("Save Unsuccessful");
                }
            });
        }
    }

    showWorkflowPage(model) {
        const {onNodeSelected, updateModel} = this.props;
        return (
            <div>
                {this.getStarterDiagramHeader(model)}
                <DragDropContextProvider backend={HTML5Backend}>
                    <div className='parent-container'>
                        <NodesPanel/>
                        <Diagram
                            model={this.getCurrentDiagram()}
                            updateModel={updateModel}
                            onNodeSelected={onNodeSelected}
                            title={this.state.title}
                        />
                        {this.show ? <Controls
                                diagramModel={model}/>
                            : null}
                    </div>
                </DragDropContextProvider>
            </div>
        );
    }

    showIndexPage() {
        return (
            <div>
                {this.state.currentAgenda === '' ?
                    <Button className="button-generic" onClick={() => {
                        this.setState({currentAgenda: 'create'})
                    }}>
                        Create a Workflow
                    </Button>
                    :
                    null
                }
                {this.state.currentAgenda === '' ?
                    <Button className="button-generic" onClick={() => this.setState({currentAgenda: 'update'})}>
                        Update a Workflow
                    </Button>
                    :
                    null
                }
                {String(this.state.currentAgenda) === 'update' ?
                    <select className="select-diagram-title-home" onChange={(e) => {
                        this.setState({title: e.target.value, diagramValue: e.target.value})
                    }}>
                        <option value="">
                            Select a title to display it's workflow ...
                        </option>
                        {
                            this.diagramTitles.map((title, key) => (
                                    <option className="select-diagram-option" key={key}>
                                        {title}
                                    </option>
                                )
                            )
                        }
                    </select> : null
                }
                {String(this.state.currentAgenda) === 'create' ?
                    <input className="input-generic" placeholder='Give a title'
                           style={{margin: '15px'}}
                           value={this.state.title} onChange={(e) => {
                        this.setState({title: e.target.value.trim()})
                    }}/> : null
                }
                {String(this.state.currentAgenda) !== '' ?
                    <Button className="button-generic" onClick={() => {
                        if (String(this.state.title) !== '') {
                            if (String(this.state.currentAgenda) === 'create') {
                                this.setState({mode: 'create'})
                            }
                            else {
                                this.setState({mode: 'update'})
                                this.setWorkflow();
                            }
                        }
                        else {
                            alert("Title cannot be empty");
                        }
                        this.forceUpdate();
                    }}>
                        Submit
                    </Button> :
                    null
                }
            </div>
        );
    }

    componentDidMount() {
        this.width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        this.height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
    }

    getZoom() {
        // console.log(this.width);
        // console.log(this.height);
        // console.log(window.innerWidth
        //     || document.documentElement.clientWidth
        //     || document.body.clientWidth);
        // console.log(window.innerHeight
        //     || document.documentElement.clientHeight
        //     || document.body.clientHeight);

        if ((this.width !== window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth)
            ||
            this.height !== window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight) {
            if (this.width !== window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth) {
                this.width = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;
            }

            if (this.height !== window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight) {
                this.height = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight;
            }

            return ((this.width / 1350 + this.height / 900) / 2) * 100;
        }
        else {
            return null;
        }
    }


    render() {

        let model = this.getDiagramEngine(this.getCurrentDiagram()).getDiagramModel();
        model.title = this.state.title;

        return (
            <div>
                {this.getHeader()}
                {this.state.mode === 'index' ? this.showIndexPage(model) : this.showWorkflowPage(model)}
            </div>
        );
    }
}


const mapStateToProps = state => ({
    selectedNode: state.history.present.selectedNode,
    model: state.history.present.model
});

const mapDispatchToProps = dispatch => ({
    onNodeSelected: node => dispatch(actions.onNodeSelected(node)),
    updateModel: (model, props) => dispatch(actions.updateModel(model, props))
});

export const Demo4 = connect(mapStateToProps, mapDispatchToProps)(Demo);
