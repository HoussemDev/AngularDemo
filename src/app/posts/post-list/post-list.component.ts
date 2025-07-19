import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../post.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']

})

export class PostListComponent implements OnInit, OnDestroy {
    // posts  = [
    //   {Title: "First post", content: "this is the first post content"},
    //   {Title: "Second post", content: "this is the Second post content"},
    //   {Title: "Third post", content: "this is the Third post content"}
    // ];

    posts: Post[]  = [];
    private postSub: Subscription;  

    constructor(public postService: PostsService){}

    ngOnInit(): void {  
        this.postService.getPosts();
        this.postSub = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
             this.posts = posts;  
        }); 
    }

    onDelete(postId: string) {
        this.postService.deletePost(postId);
      }      

    ngOnDestroy(): void {
        this.postSub.unsubscribe();
    }
}