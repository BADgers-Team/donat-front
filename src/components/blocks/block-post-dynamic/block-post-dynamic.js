import React, { Component } from 'react';
import { PRIVACY } from 'store/const';

import './block-post-dynamic.scss';

const BLUR_CLASS = 'post-dynamic__blur';

class BlockPostDynamic extends Component {
    render() {
        const { post } = this.props;
        const classes = ['post-dynamic'];
        if (post.visible_type !== PRIVACY.OPEN) {
            classes.push(BLUR_CLASS);
        }

        return (
            <div className={classes.join(' ')}>
                <div className="post-dynamic__description">
                    {post.description}
                </div>
                <div className="post-dynamic__files">

                </div>
            </div>
        );
    }
}

export default BlockPostDynamic;