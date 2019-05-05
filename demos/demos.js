import React from 'react';

export class Demos extends React.Component {
    render() {
        return (
            <div>
                <div className='demo-link'><a onClick={() => window.location.assign('workflow')}>Spring Flo</a>
                </div>
            </div>
        );
    }
}
