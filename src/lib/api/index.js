import { useFetch } from "../useFetch/useFetch";

const APIGetBlog = ()=>useFetch('v9/blog/get', 'GET')
const APIPostBlog = (_id, data)=>useFetch(`v9/blog/post/all-document/data/${_id}`, 'POST', data)
const APIPostImgDetailContent = (_id, id, data)=>useFetch(`v9/blog/post/all-document/data/image-detail-content/${_id}/${id}`, 'POST', data)

const API = {
    APIGetBlog,
    APIPostBlog,
    APIPostImgDetailContent
}

export default API