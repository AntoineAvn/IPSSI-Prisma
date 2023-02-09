interface IComment {
    id: string,
    description: string,
    postId: string,
    post: IPost,
    status: string,
    user : IUser,
    onCommentDelete: (id: string) => void,
}

interface IPost {
    id: string,
    title: string,
    body: string,
    userId: string,
    comments: IComment[],
    onCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onCommentKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    comment: string,
    onCommentDelete: (id: string) => void,
    onPostDelete: (id: string) => void,
    onPostEdit: (id: string) => void,
    onPostEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    onPostEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onPostEditKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    postEdit: string,
    onPostEditCancel: () => void,
    className: string,
    classNameTitle: string,
}

interface IUser {
    id: string,
    name: string,
    username: string,
    posts: IPost[],
    comments: IComment[],
    isAddPost: boolean,
}

export type { IComment, IPost, IUser };