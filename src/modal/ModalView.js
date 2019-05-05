import React from 'react';
import './modal.scss';

class ModalView extends React.Component {
    static modals = [];

    static open = (id) => (e) => {
        e.preventDefault();

        // open modal specified by id
        let modal = ModalView.modals.find(x => x.props.id === id);
        modal.setState({isOpen: true});
        document.body.classList.add('modal-open');
        // window.ondragstart = function() { return false; };
    };

    static close = (id) => (e) => {
        e.preventDefault();

        // close modal specified by id
        let modal = ModalView.modals.find(x => x.props.id === id);
        modal.setState({isOpen: false});
        document.body.classList.remove('modal-open');
    };

    constructor(props) {
        super(props);

        this.state = {
            conf: '',
            isOpen: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.save = this.save.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // add this modal instance to the modal service so it's accessible from other components
        ModalView.modals.push(this);
    }

    componentWillUnmount() {
        // remove this modal instance from modal service
        ModalView.modals = ModalView.modals.filter(x => x.props.id !== this.props.id);
        this.element.remove();
    }

    handleClick(e) {
        // close modal on background click
        if (e.target.className === 'modal') {
            ModalView.close(this.props.id)(e);
        }
    }

    closeModal(e) {
        ModalView.close(this.props.id)(e);
    }

    save(e) {
        ModalView.close(this.props.id)(e);
    }

    handleChange(e, key, settings) {

        const value = e.target.value;

        let configs = settings;
        configs[key].selected = value;
        this.setState({
            conf: configs
        });
    }

    handleInputChange(e, key, settings) {
        const value = e.target.value;

        settings.inputs[key] = value;
        this.setState({
            conf: settings
        });
    }

    static hider = true;

    render() {
        const {node, configs_map} = this.props;

        this.state.isOpen ? (ModalView.hider = false) : null;

        return (
            <div style={{display: +this.state.isOpen ? '' : 'none'}} onClick={this.handleClick}
                 ref={el => this.element = el}>
                <div className="modal">
                    <div className="modal-body enable-pointer-events">
                        <div className="config-header">{node.name + ' Configurations'}</div>
                        <hr/>
                        <div className="scrollable-y">
                            <table>
                                <tbody>
                                {
                                    (configs_map !== undefined) ?
                                        Object.entries(configs_map).map(([key, val], id) => {
                                            return (
                                                <tr key={id}>
                                                    {key !== 'inputs' ?
                                                        <div>
                                                            <td className="config-key">
                                                                {key}:
                                                            </td>
                                                            <td>
                                                                <select value={val['selected']}
                                                                        className="select-generic"
                                                                        onChange={(e) =>
                                                                            this.handleChange(e, key, configs_map)}>
                                                                    {
                                                                        val['options'].map((option, k) => {
                                                                            return (
                                                                                <option key={k} value={option}>
                                                                                    {option}
                                                                                </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </td>
                                                        </div> :
                                                        <div>
                                                            <td>
                                                                {
                                                                    Object.entries(val).map(([key, inp], k) => {
                                                                        return (
                                                                            <div key={k}>
                                                                                <td className="config-key">
                                                                                    {key}:
                                                                                </td>
                                                                                <td>
                                                                                    <input className="input-generic"
                                                                                           value={inp}
                                                                                           onChange={(e) =>
                                                                                               this.handleInputChange(e, key, configs_map)}/>
                                                                                </td>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </td>
                                                        </div>
                                                    }
                                                </tr>
                                            )
                                        }) :
                                        null
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="button-box">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                    onClick={this.closeModal}>Close
                            </button>
                            <button type="button" className="btn btn-primary"
                                    onClick={this.save}>Save changes
                            </button>
                        </div>
                    </div>
                </div>
                <div className="modal-background"></div>
            </div>
        );
    }
}

export default ModalView;