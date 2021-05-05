import React, {useContext} from "react"
import Grid from "@material-ui/core/Grid";
import {Avatar, Divider, makeStyles, Paper} from "@material-ui/core";
import {endpointsClient, endpointsServer, iconsPath} from "../constant/endpoints";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import {socket} from "../service/requestService";
import {AuthContext} from "./AuthProvider/AuthProvider";

const useStyles = makeStyles({
    commentsWrapper: {
        margin: ".5rem 0 0 3rem",
        width: "100%"
    },

    commentCard: {
        padding: "1rem",
    },

    comment: {
        textAlign: "left",
        padding: ".5rem 0",
        fontSize: "1rem"
    },

    time: {
        textAlign: "left",
        color: "gray",
        margin: 0,
        fontSize: ".8rem"
    },

    name: {
        textAlign: "left",
        margin: "0"
    },
});

export default function Comments({news, setState}){
    const classes = useStyles();
    const comments = news.comments;
    const context = useContext(AuthContext)

    const onCommentSend = (event) => {
        event.preventDefault();

        const comment = {
            date: Date.now(),
            content: event.target.elements[0].value,
            author: `${context.currentUser.name} ${context.currentUser.surname}` ?? "user"
        }
        console.log("comment", comment);
        socket.on(endpointsClient.updated, (data) => {
            setState(data.payload);
        });
        socket.emit(endpointsServer.putNews, {comment, _id: news['_id']});

    };

    const commentsBlocks = comments.map((comment, index) => {
        return (
            <React.Fragment key={index}>
                <Grid container wrap="nowrap" spacing={2} className={classes.commentCard}>
                    <Grid item>
                        <Avatar alt="Remy Sharp" src={`${iconsPath}/skype-icon.png`} />
                    </Grid>
                    <Grid item>
                        <h4 className={classes.name}>{comment.author}</h4>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.comment}>
                            {comment.content}
                        </Typography>
                        <p className={classes.time}>
                            {`Опубликован ${comment.date}`}
                        </p>
                    </Grid>
                </Grid>
                <Divider variant="fullWidth" className={classes.divider} />
            </React.Fragment>
            )
    });

    console.log("render2", news);
    return <Paper className={classes.commentsWrapper}>
        {commentsBlocks}
        { context.currentUser &&
            <Box px={1}>
                <form noValidate autoComplete='off' onSubmit={onCommentSend}>
                    <TextField id='title' label='Комментарий' fullWidth={true}/>
                </form>
            </Box>
        }
    </Paper>
}