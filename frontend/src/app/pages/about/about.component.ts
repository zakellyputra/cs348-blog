import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <h1>About</h1>
    <p>
      Hi, I'm Zach. I'm a computer science student interested in databases,
      web development, and building things that work well.
    </p>
    <p>
      This blog is a project for CS348 (Databases). It's built with
      Spring Boot on the backend and Angular on the frontend, backed by
      a MySQL database. The focus is on clean data modeling and useful
      SQL queries.
    </p>
    <p>
      I write about what I'm learning -- mostly programming, sometimes
      books, occasionally other things.
    </p>
  `
})
export class AboutComponent {}
