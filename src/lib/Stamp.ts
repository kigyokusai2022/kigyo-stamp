import {writable} from "svelte/store";

export class Stamp {
    public id: string;
    public name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export const stamps = writable([
    new Stamp("GWQG6W4iywNALq8TVBeq","歴史研究部"),
    new Stamp("Xu0Hb6WfafHqenLJOdOc","写真部"),
    new Stamp("fjtLFwDztZ85NllanjvW","レゴ部"),
    new Stamp("pSmajyKJ7gKfn8f0V6fK","理化学部"),
    new Stamp("xIdthXhH7yy31kXK5smP","鉄道研究部")
]);