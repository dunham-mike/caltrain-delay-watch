import React from 'react';
import moment from 'moment-timezone';

import Notification from './Notification/Notification';

const CurrentNotifications = (props) => {
    const currentNotificationsArray = props.mostRecentNotifications.filter(notif => {
        return notif.status === "Late" && moment.utc(notif.expectedDepartureTime).isAfter(moment.utc().subtract(2, 'hours'))
    });

    currentNotificationsArray.sort(
        (a, b) => (moment.utc(a.scheduledDepartureTime).isBefore(moment.utc(b.scheduledDepartureTime)) ? 1 : -1)
    );

    console.log(currentNotificationsArray);

    let lastAlertUpdateTimeText = null;

    if(props.statusLastUpdatedTime) {
        if( moment(props.statusLastUpdatedTime).tz("America/Los_Angeles").isSame(moment().tz("America/Los_Angeles"), 'day') ) {
            lastAlertUpdateTimeText = 'Last Updated: Today at ' + moment(props.statusLastUpdatedTime).format('h:mm a');
        } else {
            lastAlertUpdateTimeText = 'Last Updated: ' + moment(props.statusLastUpdatedTime).tz("America/Los_Angeles").format('ddd., MMM. Do [at] h:mm a');
        }
    }

    let notifications = (
        <React.Fragment>
            <div class="is-size-5 has-text-weight-semibold">
                No Current Notifications
            </div>
            <div class="is-size-7 has-text-weight-light">
                {lastAlertUpdateTimeText}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
                <span style={{ margin: 'auto 0' }}>Happy commuting!</span>
                <span style={{fontSize: '35px', color: 'black' }} role="img" aria-label="Rock on emoji">&#129304;</span>
                <span style={{fontSize: '35px', color: 'black' }} role="img" aria-label="Train emoji">&#128649;</span>
            </div>
        </React.Fragment>
    );

    if(currentNotificationsArray.length > 0) {
        notifications = (
            <React.Fragment>
                <div class="is-size-5 has-text-weight-semibold has-text-primary">
                    Current {(currentNotificationsArray.length > 1) ? "Notifications" : "Notification"}
                </div>
                <div class="is-size-7 has-text-weight-light">
                    {lastAlertUpdateTimeText}
                </div>
                {currentNotificationsArray.map(notif => <Notification notification={notif} />)}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {notifications}
        </React.Fragment>
    );
}

export default CurrentNotifications;