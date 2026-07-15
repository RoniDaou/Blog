import React from 'react';

export const PopularBlogsContext = React.createContext();

const reduceBlogs = (state, action) => {
    switch (action.type) {
        case 'SET_BLOGS':
            return action.blogs;

            case 'UPDATE_LIKE':
                return state.map(blog => {
                    if (blog._id === action.blog_id) {
                        let likes = [...blog.likedby];
                        let dislikes = [...blog.dislikedby];
    
                        // remove it from the dislike array if it was there
                        if (dislikes.includes(action.user_id)) {
                            dislikes = dislikes.filter(id => id !== action.user_id);
                        }
                        
                        if (!likes.includes(action.user_id)) {
                            likes.push(action.user_id)
                        } else {
                            likes = likes.filter(id => id !== action.user_id);
                        }
    
                        return {
                            ...blog,
                            likedby: likes,
                            dislikedby: dislikes
                        }
                    }
                    return blog;
                })
    
                case 'UPDATE_DISLIKE':
                    return state.map(blog => {
                        if (blog._id === action.blog_id) {
                            let dislikes = [...blog.dislikedby];
                            let likes = [...blog.likedby];
    
                            // remove it from the like array if it was there
                            if (likes.includes(action.user_id)) {
                                likes = likes.filter(id => id !== action.user_id);
                            }
                            
                            if (!dislikes.includes(action.user_id)) {
                                dislikes.push(action.user_id)
                            } else {
                                dislikes = dislikes.filter(id => id !== action.user_id);
                            }
        
                            return {
                                ...blog,
                                likedby: likes,
                                dislikedby: dislikes
                            }
                        }
                        return blog;
                    })

        default:
            return state;
    }
}

export const PopularBlogsContextProvider = ({ children }) => {
    const [popularBlogs, dispatch] = React.useReducer(reduceBlogs, []);

    return (
        <PopularBlogsContext.Provider value={{ popularBlogs, dispatch }}>
            { children }
        </PopularBlogsContext.Provider>
    )
}
