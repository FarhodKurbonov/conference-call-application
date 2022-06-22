import React, { useCallback, useContext, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import { MediaSettingsContext } from "pages/AntMedia";
import DummyCard from "./DummyCard";
import { Grid, Typography, useTheme, Box, Tooltip, Fab } from "@mui/material";
import { SvgIcon } from "../SvgIcon";
import { useTranslation } from "react-i18next";
import { AntmediaContext } from "../../App";
import _ from "lodash";
const CustomizedVideo = styled("video")({
  borderRadius: 4,
  width: "100%",
  height: "100%",
  objectPosition: "center",
  backgroundColor: "transparent",
});

const VideoCard = ({ srcObject, hidePin, onHandlePin, ...props }) => {
  const mediaSettings = useContext(MediaSettingsContext);
  const antmedia = useContext(AntmediaContext);
  const { t } = useTranslation();
  const [displayHover, setDisplayHover] = React.useState(false);
  const theme = useTheme();

  const cardBtnStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green.10",
    width: { xs: "6vw", md: 32 },
    height: { xs: "6vw", md: 32 },
    borderRadius: "50%",
    position: "relative",
  };

  const refVideo = useCallback(
    (node) => {
      if (node && props.track) {
        node.srcObject = new MediaStream([props.track]);
      }
    },
    [props.track]
  );
  // React.useEffect(() => {
  //   console.log("props.track", props.track);
  //   if (props.track?.kind === "video") {
  //     props.track.onmute = (event) => {
  //       var remove = true;
  //       alert(`cıkıyorrrr! ${props.id}`);
  //     };
  //   }
  // }, []);

  let isOff = mediaSettings?.cam?.find(
    (c) => c.eventStreamId === props?.id && !c?.isCameraOn
  );

  // if i sharing my screen.
  if (
    mediaSettings.isScreenShared === true &&
    props?.id === "localVideo" &&
    mediaSettings?.cam.find(
      (c) => c.eventStreamId === "localVideo" && c.isCameraOn === false
    )
  ) {
    isOff = false;
  }
  // screenSharedVideoId is the id of the screen share video.
  if (
    mediaSettings.screenSharedVideoId === props?.id &&
    mediaSettings?.cam.find(
      (c) => c.eventStreamId === props?.id && c.isCameraOn === false
    )
  ) {
    isOff = false;
  }
  const mic = mediaSettings?.mic?.find((m) => m.eventStreamId === props?.id);

  const [isTalking, setIsTalking] = React.useState(false);
  const throttledSetIsTalking = useRef(
    _.throttle((value) => {
      setIsTalking(value);
    }, 1000)
  );
  const isLocal = props?.id === "localVideo";
  const mirrorView = isLocal && !mediaSettings?.isScreenShared;
  const isScreenSharing =
    mediaSettings?.isScreenShared ||
    mediaSettings?.screenSharedVideoId === props?.id;
  useEffect(() => {
    if (isLocal && mediaSettings.isPublished) {
      antmedia.enableAudioLevelForLocalStream((value) => {
        // sounds under 0.01 are probably background noise
        if (value > 0.01) {
          setIsTalking(true);
        } else {
          throttledSetIsTalking.current(false);
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaSettings.isPublished]);

  return isLocal || props.track?.kind !== "audio" ? (
    <>
      <Grid
        container
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
        onMouseEnter={() => setDisplayHover(true)}
        onMouseLeave={(e) => setDisplayHover(false)}
      >
        {!hidePin && (
          <Grid
            container
            justifyContent={"center"}
            alignItems="center"
            sx={{
              opacity: displayHover ? 1 : 0,
              transition: "opacity 0.3s ease",
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              background: "#2929295c",
              zIndex: 10,
              borderRadius: "10px",
            }}
          >
            <Grid
              container
              justifyContent={"center"}
              alignItems="center"
              style={{ height: "100%" }}
              spacing={2}
            >
              <Grid item>
                <Tooltip
                  title={`${props.pinned ? t("unpin") : t("pin")} ${
                    props.name
                  }`}
                  placement="top"
                >
                  <Fab
                    onClick={onHandlePin}
                    color="primary"
                    aria-label="add"
                    size="small"
                  >
                    <SvgIcon
                      size={36}
                      name={props.pinned ? t("unpin") : t("pin")}
                      color={theme.palette.grey[80]}
                    />
                  </Fab>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        )}

        <div
          className={`single-video-card`}
          // style={{
          //   ...(isTalking || mediaSettings.talkers.includes(props.id) ? {
          //     outline: `thick solid ${theme.palette.primary.main}`,
          //     borderRadius: '10px'
          //   } : {})
          // }}
        >
          <Grid
            sx={isOff ? {} : { display: "none" }}
            style={{ height: "100%" }}
            container
          >
            <DummyCard />
          </Grid>

          <Grid
            container
            sx={isOff ? { display: "none" } : {}}
            style={{
              height: "100%",
              transform: mirrorView ? "rotateY(180deg)" : "none",
            }}
          >
            <CustomizedVideo
              {...props}
              style={{ objectFit: isScreenSharing ? "contain" : "cover" }}
              ref={refVideo}
              playsInline
            ></CustomizedVideo>
          </Grid>

          <div
            className="talking-indicator-light"
            style={{
              ...(isTalking || mediaSettings.talkers.includes(props.id)
                ? {}
                : { display: "none" }),
            }}
          ></div>

          <Grid
            container
            className="video-card-btn-group"
            columnSpacing={1}
            direction="row-reverse"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              p: { xs: 1, md: 2 },
              zIndex: 9,
            }}
          >
            {mic && mic.isMicMuted && (
              <Tooltip title={t("mic is muted")} placement="top">
                <Grid item>
                  <Box sx={cardBtnStyle}>
                    <SvgIcon
                      size={32}
                      name={"muted-microphone"}
                      color={theme.palette.grey[80]}
                    />
                  </Box>
                </Grid>
              </Tooltip>
            )}
            {/* <Grid item>
              <Box sx={cardBtnStyle}>
                <SvgIcon size={36} name={'voice-indicator'} color={theme.palette.grey[80]} />
              </Box>
            </Grid>
             */}
            {props.pinned && (
              <Tooltip title={t("pinned by you")} placement="top">
                <Grid item>
                  <Box sx={cardBtnStyle}>
                    <SvgIcon
                      size={36}
                      name={"pin"}
                      color={theme.palette.grey[80]}
                    />
                  </Box>
                </Grid>
              </Tooltip>
            )}
          </Grid>
          {props.name && (
            <div className="name-indicator">
              <Typography color="white" align="left" className="name">
                {props.name}
              </Typography>
            </div>
          )}
        </div>
      </Grid>
    </>
  ) : (
    <>
      <video
        style={{ display: "none" }}
        {...props}
        ref={refVideo}
        playsInline
      ></video>
    </>
  );
};

export default VideoCard;
