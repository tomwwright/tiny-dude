import * as React from 'react';
import { inject } from 'mobx-react';

import { Paper, Typography } from 'material-ui';
import { withStyles, WithStyles } from 'material-ui/styles';

const styles = withStyles<string>(theme => ({
  link: {
    color: theme.palette.primary[100],
  },
  greyBackground: {
    background: theme.palette.primary.A200,
  },
  whiteText: {
    color: theme.palette.common.white,
  },
}));

// 'emptyProp' because if WithStyles is the only type parameter the compiler complains about 'classes' not being passed
const WelcomeComponent: React.StatelessComponent<{ emptyProp: string } & WithStyles> = props => (
  <Paper className={props.classes.greyBackground}>
    <Typography className={props.classes.whiteText} type="body1" component="p">
      Tiny Dude is a web implementation of the{' '}
      <a className={props.classes.link} href="https://en.wikipedia.org/wiki/Little_man_computer">
        Little Man Computer
      </a>{' '}
      (LMC) instructional model, built with{' '}
      <a className={props.classes.link} href="https://reactjs.org/">
        React
      </a>,{' '}
      <a className={props.classes.link} href="https://mobx.js.org/">
        MobX
      </a>, and{' '}
      <a className={props.classes.link} href="https://material-ui-next.com/">
        Material UI
      </a>.
    </Typography>
  </Paper>
);

export const Welcome = styles(WelcomeComponent);
