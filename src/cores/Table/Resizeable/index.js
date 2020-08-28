import React from 'react';
import T from 'prop-types';
import { ResizeElm } from './styled';
import { connect } from 'react-redux';
class Resizeable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.node = null;
        this.state = {
            pageX: 0,
			onFocus: false,
			currentWidth: 0,
            nextWidth: 0,
        };
        
    }

    componentDidMount() {
        this.node.addEventListener('mousedown', this.handleMousedown);
        document.addEventListener('mouseup', this.handleMouseup);
    }

    componentWillUnmount() {
        this.node.removeEventListener('mousedown', this.handleMousedown);
        document.removeEventListener('mouseup', this.handleMouseup);
    }

    setNode = node => {
        this.node = node;
    };

    handleMousedown = (e) => {
        const { component, columKey } = this.props;

        document.addEventListener('mousemove', this.handleMousemove);
        const curCol = e.target.parentElement;
       
        const cols = component.props.cols
        
        // const nxtColWidth = nxtCol.offsetWidth
        const curtWidth = curCol.offsetWidth
        this.setState({
            onFocus: true,
            pageX: e.pageX,
			nextWidth: cols[columKey +1] && cols[columKey +1].width,
			currentWidth: curtWidth,
            
        });
    };
    handleMouseup = () => {
        document.removeEventListener('mousemove', this.handleMousemove);
        
        
        this.setState({
            pageX: 0,
			onFocus: false,
			currentWidth: 0,
            nextWidth: 0,
        });
    };

    handleMousemove = (e) => {
        const { component, columKey, updateComponents } = this.props;
        const { pageX, onFocus, currentWidth, nextWidth } = this.state;

        if (pageX && onFocus) {
            const diffX = e.pageX - pageX;
            let cols = component.props.cols
            cols[columKey].width = currentWidth + (diffX);
           if(cols[columKey +1] ) {
            cols[columKey +1].width = nextWidth ? nextWidth - diffX : null ;
           }
            
            updateComponents({
                ...component,
                props: {
                    ...component.props,
                    cols

                }
            });
        }
    };

   
    render() {
        

        return (
            <ResizeElm className={'resize-item'} ref={this.setNode} />
        );
    }
}

Resizeable.defaultProps = {
    className: '',
    updateComponents: () => { },
    component: {},
    columKey: null
};

Resizeable.propTypes = {
    className: T.string,
    resizeable: T.func,
    component: T.shape({}),
    columKey: T.number
};

const mapState = (state) => ({
    files: state.files,
    config: state.config
});
const mapDispatch = ({ config: { updateComponents, focusComponent } }) => ({ updateComponents, focusComponent });

export default connect(mapState, mapDispatch)(Resizeable);
