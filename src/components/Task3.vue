<template>
<div>
    <h1>Task 3: Mini Forum</h1>
    <button @click="run">Show Posts</button>
    <response-viewer :response="result"/>

    <h1>Create Post</h1>
    <div><label>Content</label><textarea v-model="content"/></div>
    <button @click="createPost">Create</button>
    <response-viewer :response="createPostResp"/>

    <h1>Update Post</h1>
    <div><label>ID</label><input v-model="id" /></div>
    <div><label>Content</label><textarea v-model="content2"/></div>
    <button @click="patchPost">Update</button>
    <response-viewer :response="patchPostResp"/>

    <h1>Delete Post</h1>
    <div><label>ID</label><input v-model="id2" /></div>
    <button @click="deletePost">Delete</button>
    <response-viewer :response="deletePostResp"/>

</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from 'axios'

@Component
export default class HelloWorld extends Vue {
    result : AxiosResponse<any> | null = null;
    createPostResp : AxiosResponse<any> | null = null;
    patchPostResp : AxiosResponse<any> | null = null;
    deletePostResp : AxiosResponse<any> | null = null;

    content = ""
    content2 = ""
    id = ""
    id2 = ""

    async run() {
        try {
            this.result = await axios.get('/posts');
        } catch(e) {
            if(e.response) {
                this.result = e.response;
            } else {
                console.error(e);
            }
        }
    }

    async createPost() {
        try {
            this.createPostResp = await axios.post('/posts', {
                // TODO: Task 3 Part 2
                content: this.content,
            }, {
                headers: {
                    'Authorization': this.$store.state.accessToken ? `Bearer ${this.$store.state.accessToken}` : ''
                },
            });
        } catch(e) {
            if(e.response) {
                this.createPostResp = e.response;
            } else {
                console.error(e);
            }
        }
    }

    async patchPost() {
        try {
            this.patchPostResp = await axios.patch(`/posts/${this.id}`, {
                // TODO: Task 3 Part 3
                content: this.content2,
            }, {
                headers: {
                    'Authorization': this.$store.state.accessToken ? `Bearer ${this.$store.state.accessToken}` : ''
                },
            });
        } catch(e) {
            if(e.response) {
                this.patchPostResp = e.response;
            } else {
                console.error(e);
            }
        }
    }

    async deletePost() {
        try {
            this.deletePostResp = await axios.delete(`/posts/${this.id2}`, {
                headers: {
                    'Authorization': this.$store.state.accessToken ? `Bearer ${this.$store.state.accessToken}` : ''
                }
            });
        } catch(e) {
            if(e.response) {
                this.deletePostResp = e.response;
            } else {
                console.error(e);
            }
        }
    }
}
</script>

<style scoped>

</style>
