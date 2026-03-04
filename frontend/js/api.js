class EmployeeApi {

    requireLogin() {

        let authRequest = this.doRequest('auth', { 'req': 'requireLogin' } );

        authRequest.catch (
            function( data ) {
                document.location.href = '/frontend/login.html';
            }
        )

        return authRequest;
    }

    doLogin( username, password ) {

        let req = this.doRequest('auth', 
            { 'req': 'doLogin', 'username': username, 'password': password },
            'POST'
        );

        return req;

    }

    getData(id) {

        return this.doRequest('employee', { id: id } );
    }

    listEmployees() {
        return this.doRequest('employee', { req: 'list' } );
    }

    deleteEmployee(id) {
        return this.doRequest('employee', { req: 'delete', id: id }, 'POST');
    }

    createEmployee(data) {
        let params = Object.assign({}, data);
        params.req = 'create';
        return this.doRequest('employee', params, 'POST');
    }

    updateData(id, data) {
        let params = Object.assign({}, data);
        params.id = id;
        params.req = 'update';
        return this.doRequest('employee', params, 'POST');
    }

    doLogout() {
        return this.doRequest('auth', { req: 'logout' }, 'POST');
    }

    doRequest( obj_type, params, method ) {

        let param;
        let param_string = '';

        for( param in params ) {
            param_string = param_string + encodeURIComponent(param) + '=' + encodeURIComponent(params[param]) + '&';
        }

        let request = new XMLHttpRequest();
        let http_method = method || 'GET';

        return new Promise( 
            function(resolve, reject) {
                request.onreadystatechange = function() {

                    // Only run if the request is complete
                    if (request.readyState !== 4) return;
                    
                    if (request.status >= 200 && request.status < 300) {
                        // If successful
                        let ret = JSON.parse(request.responseText);

                        if ( typeof(ret.success) != 'undefined' ) {
                            if ( ret.success != true ) {
                                reject({
                                    status: request.status,
                                    statusText: request.statusText
                                })
                            }
                        }
                        
                        console.log('responsetext', request.responseText);
				        resolve(ret);
                    } 
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                        
                    }
                }

                if ( http_method === 'POST' ) {
                    request.open("POST", "/api.php", true);
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    request.send('obj=' + encodeURIComponent(obj_type) + '&' + param_string);
                }
                else {
                    request.open("GET", "/api.php?obj=" + obj_type + '&' + param_string, true);
                    request.send();
                }
            }
        );
        

    }
}
