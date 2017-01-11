import request from 'superagent-bluebird-promise';
import config  from './config';
import chalk   from 'chalk';

/**
 * @param {Mozaik} mozaik
 */
const client = function (mozaik) {

    mozaik.loadApiConfig(config);

    function buildApiRequest(url) {
        let ApiUrl     = (url) ? url : config.get('json.url');
        let headers = config.get('json.headers');
        let req     = request.get(ApiUrl);

        headers.forEach(function(header){
            req.set(header.name, header.value);
        });
        mozaik.logger.info(chalk.yellow(`[json] calling ${ url }`));

        return req.promise();
    }

    const apiCalls = {
        data(params) {
            return buildApiRequest(params.url)
                .then(res => JSON.parse(res.text))
            ;
        }
    };
    return apiCalls;
};

export { client as default };