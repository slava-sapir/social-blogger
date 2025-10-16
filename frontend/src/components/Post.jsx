import { Link } from 'react-router-dom'

export default function Post(props) {
const { post } = props;
  return (
    <>
    <Link onClick={props.onClick} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
        <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{post.title}</h5>
            <small>{new Date(post.createdDate).toLocaleDateString()}</small>
        </div>
        <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>
        <span className="text-muted small">{!props.noAuthor && ` by ${post.author.username}`}</span>
    </Link>
    </>
  )
}
