import {useTranslation} from "react-i18next";
import {Button, Container, Grid, TextField, Tooltip, Typography} from "@mui/material";
import {SettingsDialog} from "../Footer/Components/SettingsDialog";
import React from "react";
import {SvgIcon} from "../SvgIcon";
import {AntmediaContext} from "../../App";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import VideoCard from "../Cards/VideoCard";
import CameraButton from "../Footer/Components/CameraButton";
import MicButton, {CustomizedBtn, roundStyle} from "../Footer/Components/MicButton";
import WaitingRoom from "../../pages/WaitingRoom";

function PublisherModeWaitingRoom(props) {
//const PublisherModeWaitingRoom = (props) => {

    const { id } = useParams();
    const { t } = useTranslation();

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectFocus, setSelectFocus] = React.useState(null);

    const roomName = id;
    const antmedia = React.useContext(AntmediaContext);
    const { enqueueSnackbar } = useSnackbar();

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function joinRoom(e) {
        if (antmedia.mediaManager.localStream === null && antmedia.isPlayMode === false) {
            e.preventDefault();
            enqueueSnackbar(
                {
                    message: t(
                        "You need to allow microphone and camera permissions before joining"
                    ),
                    variant: "info",
                    icon: <SvgIcon size={24} name={"muted-microphone"} color="#fff" />,
                },
                {
                    autoHideDuration: 1500,
                }
            );
            return;
        }
        var generatedStreamId = props.streamName.replace(/[\W_]/g, "") + "_" + makeid(10);

        console.log("generatedStreamId:"+generatedStreamId);

        antmedia.joinRoom(roomName, generatedStreamId);
        props.handleChangeRoomStatus("meeting");
    }
    const handleDialogOpen = (focus) => {
        if (false && antmedia.mediaManager.localStream === null) {
            enqueueSnackbar(
                {
                    message: t(
                        "You need to allow microphone and camera permissions before changing settings"
                    ),
                    variant: "info",
                    icon: <SvgIcon size={24} name={"muted-microphone"} color="#fff" />,
                },
                {
                    autoHideDuration: 1500,
                }
            );
            return;
        }
        setSelectFocus(focus);
        setDialogOpen(true);
    };

    const handleDialogClose = (value) => {
        setDialogOpen(false);
    };

    return (
        <Container>
            <SettingsDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                selectFocus={selectFocus}
                handleBackgroundReplacement={props.handleBackgroundReplacement}
            />
            <Grid
                container
                spacing={4}
                justifyContent="space-between"
                alignItems={"center"}
            >
                <Grid item md={7} alignSelf="stretch">
                    <Grid
                        container
                        className="waiting-room-video"
                        sx={{position: "relative"}}
                    >
                        <VideoCard id="localVideo" autoPlay muted hidePin={true}/>

                        <Grid
                            container
                            columnSpacing={2}
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                p: 2,
                                zIndex: 10,
                            }}
                        >
                            <Grid item>
                                <CameraButton rounded/>
                            </Grid>
                            <Grid item>
                                <MicButton rounded/>
                            </Grid>
                            <Grid item sx={{position: "absolute", bottom: 16, right: 16}}>
                                <Tooltip title={t("More options")} placement="top">
                                    <CustomizedBtn
                                        variant="contained"
                                        color="secondary"
                                        sx={roundStyle}
                                        onClick={() => handleDialogOpen()}
                                    >
                                        <SvgIcon size={40} name={"settings"} color={"white"}/>
                                    </CustomizedBtn>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Typography align="center" color="#DDFFFC" sx={{mt: 2}}>
                        {t(
                            "You can choose whether to open your camera and microphone before you get into room"
                        )}
                    </Typography>
                </Grid>

                <Grid item md={4}>
                    <Grid container justifyContent={"center"}>
                        <Grid container justifyContent={"center"}>
                            <Typography variant="h5" align="center">
                                {t("What's your name?")}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            justifyContent={"center"}
                            sx={{mt: {xs: 1, md: 2.5}}}
                        >
                            <Typography
                                variant="h6"
                                align="center"
                                fontWeight={"400"}
                                style={{fontSize: 18}}
                            >
                                {t(
                                    "Please enter your name. This will be visible to the host and other participants."
                                )}{" "}
                            </Typography>
                        </Grid>

                        <form
                            onSubmit={(e) => {
                                joinRoom(e);
                            }}
                        >
                            <Grid item xs={12} sx={{mt: 3, mb: 4}}>
                                <TextField
                                    autoFocus
                                    required
                                    fullWidth
                                    color="primary"
                                    value={props.streamName}
                                    variant="outlined"
                                    onChange={(e) => props.handleStreamName(e.target.value)}
                                    placeholder={t("Your name")}
                                    id="participant_name"
                                />
                            </Grid>
                            <Grid container justifyContent={"center"}>
                                <Grid item sm={6} xs={12}>
                                    <Button
                                        fullWidth
                                        color="secondary"
                                        variant="contained"
                                        type="submit"
                                        id="room_join_button"
                                    >
                                        {t("I'm ready to join")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default PublisherModeWaitingRoom;
