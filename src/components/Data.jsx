import React, { Component, PropTypes } from 'react';
import reactMixin                      from 'react-mixin';
import { ListenerMixin }               from 'reflux';
import Mozaik                          from 'mozaik/browser';


class Data extends Component {
    constructor(props) {
        super(props);

        this.state = {title: null, value: null, unit: null, alter: null};
    }

    getInitialState() {
        return {
            title: null,
            value: null,
            unit: null,
            alter: null
        };
    }

    getApiRequest() {
        return {
            id: 'json.data',
            params: {
                title: this.props.title,
                value: this.props.value,
                unit: this.props.unit,
                alter: this.props.alter,
                url: this.props.url
            }
        };
    }

    findProp(obj, prop, defval) {
        if (typeof defval === 'undefined') defval = null;
        if (typeof prop !== 'undefined' && prop && prop.match(/\$\{.*\}/)) {
            // ${key.prop.value} -> key.prop.value
            prop = prop.split('${')[1].split('}')[0]
            // key.prop.value -> [key, prop, value]
            prop = prop.split('.');
            for (var i = 0; i < prop.length; i++) {
                if (typeof obj[prop[i]] == 'undefined')
                    return defval;
                obj = obj[prop[i]];
            }
            return obj;
        }
        else {
            return prop;
        }
    }

    onApiData(data) {
        // Filter if defined
        if (this.props.alter) {
            var alter = eval("(" + this.props.alter + ")");
            data = alter(data);
        }
        this.setState({
            title: this.findProp(data, this.props.title),
            value: this.findProp(data, this.props.value),
            unit: this.findProp(data, this.props.unit)
        });
    }

    getIcon(value) {
        if (value > 70) {
            return 'fa fa-smile-o'
        } else if (value > 40) {
            return 'fa fa-meh-o'
        } else {
            return 'fa fa-frown-o'
        }
    }

    render() {
        let unit = null;
        const title = this.state.title || 'unknown';
        const value = this.state.value || 'unknown';

        // handle no data
        if ((!value[0].includes('no data'))) {
            unit = this.state.unit || null;
        }

        const icon = this.getIcon(value);

        return (
            <div>
                <div className="widget__header">
                    <span className="widget__header__subject">
                        {title}
                    </span>
                    <i className="fa fa-users"/>
                </div>
                <div className="json__value">
                    <span>
                        {value} {unit}
                    </span>
                </div>
                <div className="icon">
                    <span>
                        <i className={icon}/>
                    </span>
                </div>
            </div>
        );
    }
}

Data.displayName = 'Data';

Data.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number,
    unit: PropTypes.string,
    url: PropTypes.string
};

Data.defaultProps = {
    title: 'Mozaïk JSON widget',
    value: 0,
    unit: '',
    url: ''
};

reactMixin(Data.prototype, ListenerMixin);
reactMixin(Data.prototype, Mozaik.Mixin.ApiConsumer);

export { Data as default };
