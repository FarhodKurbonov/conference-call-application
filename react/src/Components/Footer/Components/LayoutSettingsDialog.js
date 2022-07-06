import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import DialogContent from '@mui/material/DialogContent';
import { SettingsContext } from 'pages/AntMedia';
import { AntmediaContext } from "App";

import { Grid, Typography, useMediaQuery } from '@mui/material';
import { SvgIcon } from 'Components/SvgIcon';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const AntDialogTitle = props => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle {...other}>
      {children}
      {onClose ? (
        <Button
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 26,
            top: 27,
          }}
        >
          <SvgIcon size={30} name={'close'} color={'white'} />
        </Button>
      ) : null}
    </DialogTitle>
  );
};

export function LayoutSettingsDialog(props) {
  const { t } = useTranslation();
  const { onClose, selectedValue, open } = props;
  const settings = React.useContext(SettingsContext);
  const antmedia = React.useContext(AntmediaContext);
  const { pinnedVideoId, pinVideo, setMaxVideoTrackCount, globals } = settings;
  const [layout, setLayout] = React.useState(pinnedVideoId !== null ? 'sidebar' : 'tiled'); //just for radioo buttons

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  React.useEffect(() => {
    setLayout(pinnedVideoId !== null ? 'sidebar' : 'tiled');
  }, [pinnedVideoId])
  const handleClose = () => {
    onClose(selectedValue);
  };

  const changeLayout = event => {
    const mode = event.target.value;
    setLayout(mode);

    if (mode === 'tiled') {
      console.log('switch to tiled');

      //unpin the pinned video
      pinVideo(pinnedVideoId);
    } else if (mode === 'sidebar') {
      const participants = document.querySelectorAll('.single-video-container.not-pinned video')
      const firstParticipant = participants.length > 1 ? participants[1] : participants[0]

      //pin the first participant
      pinVideo(firstParticipant?.id ? firstParticipant.id : 'localVideo');
    }
  };
  const radioLabel = (label, icon) => {
    return (
      <Grid container style={{ width: '100%' }} alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography color="#fff">{label}</Typography>
        </Grid>
        <Grid item sx={{ pr: 0.5, pl: 0.5, pt: 1.5, pb: 1.5, bgcolor: '#ffffff1a', borderRadius: 4 }}>
          <SvgIcon size={42} name={icon} color={'white'} />
        </Grid>
      </Grid>
    );
  };
  const handleChange = (count) => {
    antmedia.handleSetMaxVideoTrackCount(count)
    setMaxVideoTrackCount(count)
    globals.maxVideoTrackCount = count
  }
  //const actualLayout = pinnedVideoId !== null ? 'sidebar' : 'tiled';
  return (
    <Dialog onClose={handleClose} open={open} fullScreen={fullScreen} maxWidth={'xs'}>
      <AntDialogTitle onClose={handleClose}>{t('Change Layout')}</AntDialogTitle>
      <Typography variant="body2" color="#fff">
        {t('You can choose either tiled or sidebar view.')}
      </Typography>
      <DialogContent sx={{ pl: 1, pr: 1 }}>
        <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Grid container>
            <FormControl sx={{ width: '100%' }}>
              <RadioGroup
                aria-labelledby="layout-radio-buttons"
                defaultValue={pinnedVideoId !== null ? 'sidebar' : 'tiled'}
                value={layout}
                onChange={changeLayout}
                name="layout-radio-buttons-group"
              >
                <FormControlLabel classes={{ label: 'layout-radio-label' }} sx={{ width: '100%', pb: 1 }} value="tiled" control={<Radio />} label={radioLabel('Tiled', 'tiled')} />
                <FormControlLabel classes={{ label: 'layout-radio-label' }} sx={{ width: '100%' }} value="sidebar" control={<Radio />} label={radioLabel('Sidebar', 'sidebar')} />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Box>
        <Grid>
        <Slider
            aria-label="video track count"
            defaultValue={3}
            step={null}
            min={3}
            max={12}
            marks={[
              {
                value: 3,
                label: '3',
              },
              {
                value: 6,
                label: '6',
              },
              {
                value: 9,
                label: '9',
              },
              {
                value: 12,
                label: '12',
              },
            ]}
            onChange={(e) => {
              console.log('e: ', e.target.value);
              //antmedia.handleSetMaxVideoTrackCount(e.target.value);
            }}
          />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
