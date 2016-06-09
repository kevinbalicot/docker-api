'use strict';

import {Component} from '@angular/core';
import {ListContainer} from './list-container';
import {ListImage} from './list-image';

@Component({
    selector: 'docker-app',
    directives: [ListContainer, ListImage],
    template: `
    <h1>Docker API</h1>
    <hr/>
    <h2>Images</h2>
    <docker-app-list-image></docker-app-list-image>
    <h2>Containers</h2>
    <docker-app-list-container></docker-app-list-container>
    `
})
export class App {

    constructor () {}
}
