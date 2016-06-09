'use strict';

import {Component} from '@angular/core';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'docker-app-list-image',
    providers: [HTTP_PROVIDERS],
    template: `
    <table class="table">
        <tr><th>Id</th><th>Tags</th><th>Actions</th><tr>
        <tr *ngFor="let image of images">
            <td>{{ image.Id }}</td>
            <td>{{ image.RepoTags.join() }}</td>
            <td>
                <button class="btn btn-danger btn-xs">Supprimer</button>
            </td>
        </tr>
    </table>
    <div class="alert alert-info" *ngIf="images.length === 0" role="alert">Aucune images.</div>
    `
})
export class ListImage {

    constructor (http: Http) {
        this.images = [];

        http.get('http://92.222.88.16:8080/images')
            .map(res => res.json())
            .subscribe(images => this.images = images);
    }
}
