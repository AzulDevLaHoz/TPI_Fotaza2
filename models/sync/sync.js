import sequelize from "../config/config.js";

import { Collection } from "../model/Collection.js";
import { Comment } from "../model/Comment.js";
import { Image } from "../model/Image.js";
import { Label } from "../model/Label.js";
import { Message } from "../model/Message.js";
import { Notification } from "../model/Notification.js";
import { Post } from "../model/Post.js";
import { Rating } from "../model/Rating.js";
import { Report } from "../model/Report.js";
import { User } from "../model/User.js";

//User 1----N Post
User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });


//Post 1----N Image
Post.hasMany(Image, { foreignKey: "post_id" });
Image.belongsTo(Post, { foreignKey: "post_id" });


//Post N----M Label
Post.belongsToMany(Label, { through: "post_labels", foreignKey: "post_id", otherKey: "label_id", timestamps: false });
Label.belongsToMany(Post, { through: "post_labels", foreignKey: "label_id", otherKey: "post_id", timestamps: false });


//User 1----N Comment
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });


//Image 1----N Comment
Image.hasMany(Comment, { foreignKey: "image_id" });
Comment.belongsTo(Image, { foreignKey: "image_id" });


//User 1-----N Rating
User.hasMany(Rating, { foreignKey: "user_id" });
Rating.belongsTo(User, { foreignKey: "user_id" });


//Image 1-----N Rating
Image.hasMany(Rating, { foreignKey: "image_id" });
Rating.belongsTo(Image, { foreignKey: "image_id" });


//User N-----M User (Seguidores)
User.belongsToMany(User, { as: "following", through: "follows", foreignKey: "follower_user_id", otherKey: "following_user_id" }); //a quien sigo: Yo.following
User.belongsToMany(User, { as: "follower", through: "follows", foreignKey: "following_user_id", otherKey: "follower_user_id" }); //quienes me siguen Yo.follower


//User 1-----N Collection
User.hasMany(Collection, { foreignKey: "owner_id" });
Collection.belongsTo(User, { foreignKey: "owner_id" });


//Collection N-----M Post
Collection.belongsToMany(Post, { through: "collection_posts", foreignKey: "collection_id", otherKey: "post_id" });
Post.belongsToMany(Collection, { through: "collection_posts", foreignKey: "post_id", otherKey: "collection_id" });


//User N-----M Message (EMISOR)
User.hasMany(Message, { as: "SendMessages", foreignKey: "sender_user_id" });
Message.belongsTo(User, { as: "Sender", foreignKey: "sender_user_id" });


//User N-----M Message (RECEPTOR)
User.hasMany(Message, { as: "ReceivedMessages", foreignKey: "received_user_id" });
Message.belongsTo(User, { as: "Receiver", foreignKey: "received_user_id" });


//User N-----M Notification (RECEPTOR)
User.hasMany(Notification, { as: "Notificaciones", foreignKey: "receiver_user_id" });
Notification.belongsTo(User, { as: "Usuario", foreignKey: "receiver_user_id" });


//User N-----M Notification (ACTOR)
User.hasMany(Notification, { as: "AccionesGeneradas", foreignKey: "sender_user_id" });
Notification.belongsTo(User, { as: "Actor", foreignKey: "sender_user_id" });


//Comment 1-----N Notification
Comment.hasMany(Notification, {
    foreignKey: "comment_id"
});
Notification.belongsTo(Comment, {
    foreignKey: "comment_id"
});


//Rating 1-----N Notification
Rating.hasMany(Notification, {
    foreignKey: "rating_id"
});

Notification.belongsTo(Rating, {
    foreignKey: "rating_id"
});



//Reports
User.hasMany(Report, {
    foreignKey: "user_id"
});

Report.belongsTo(User, {
    foreignKey: "user_id"
});


//Report to Image
Image.hasMany(Report, {
    foreignKey: "image_id"
});
Report.belongsTo(Image, {
    foreignKey: "image_id"
});


//Report to Comment
Comment.hasMany(Report, {
    foreignKey: "comment_id"
});
Report.belongsTo(Comment, {
    foreignKey: "comment_id"
});

export {
    Collection,
    Comment,
    Image,
    Label,
    Message,
    Notification,
    Post,
    Rating,
    Report,
    User
}