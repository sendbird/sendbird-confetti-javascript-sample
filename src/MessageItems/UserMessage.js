import React, { useState } from "react";

import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  highlighted: {
    backgroundColor: "rgba(255,229,100,0.2)"
  }
});

const HIGHLIGHT = "highlight";

export default function UserMessage(props) {
  const classes = useStyles();
  // props
  const { message, userId, onDeleteMessage, onUpdateMessage } = props;
  const { customType } = message;
  const isHighlighted = customType === HIGHLIGHT;

  // useState
  const [pressedUpdate, setPressedUpdate] = useState(false);
  const [messageText, changeMessageText] = useState(message.message);

  return (
    <div className="user-message">
      <Card className={isHighlighted && classes.highlighted}>
        <CardHeader
          avatar={
            message.sender ? (
              <Avatar alt="Us" src={message.sender.profileUrl} />
            ) : (
              <Avatar className="user-message__avatar">Us</Avatar>
            )
          }
          title={
            message.sender
              ? message.sender.nickname || message.sender.userId
              : "(No name)"
          }
        />
        <CardContent>
          {!pressedUpdate && (
            <Typography variant="body2" component="p">
              {message.message}
            </Typography>
          )}
          {pressedUpdate && (
            <div className="user-message__text-area">
              <TextField
                label="Edited text"
                multiline
                variant="filled"
                rowsMax={4}
                value={messageText}
                onChange={event => {
                  changeMessageText(event.target.value);
                }}
              />
            </div>
          )}
        </CardContent>
        {message.sender && message.sender.userId === userId && (
          <CardActions>
            {!pressedUpdate && (
              <Button
                size="small"
                variant="contained"
                onClick={() => onDeleteMessage(message)}
              >
                Delete
              </Button>
            )}
            {pressedUpdate && (
              <Button
                size="small"
                variant="contained"
                onClick={() => setPressedUpdate(false)}
              >
                Cancel
              </Button>
            )}
            {!pressedUpdate && (
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setPressedUpdate(true);
                }}
              >
                Update
              </Button>
            )}
            {pressedUpdate && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => onUpdateMessage(message.messageId, messageText)}
              >
                Save
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </div>
  );
}
