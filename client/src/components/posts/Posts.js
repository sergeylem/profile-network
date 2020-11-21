import React, {useEffect, Fragment} from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner';
import { getPosts } from '../../actions/post'
import { connect } from 'react-redux';


const Posts = ({getPosts, post: {post, loading} }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts])

  return (
    <div>

    </div>
  )
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, {getPosts})(Posts);
