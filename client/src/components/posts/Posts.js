import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import { getPosts } from '../../actions/post'
import { connect } from 'react-redux';

const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts])

  return loading ? (
    <Spinner />
  ) : (
      <Fragment>
        <h1 className="large text-primary">Posts</h1>
        <p className='lead'>
          <i className='fas fa-user'>Welcome to the community</i>
        </p>
        <div className='posts'>
          {posts.map(post=> (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      </Fragment>
    )


}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPosts })(Posts);
