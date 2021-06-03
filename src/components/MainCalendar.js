import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

class MainCalendar extends Component {
    state = {
        events: [],
    };

    componentDidMount() {
        const events = localStorage.getItem('events');
        const result = JSON.parse(events);
        const newEvents = result?.map((event) => {
            return {
                id: event.id,
                start: new Date(event.start),
                end: new Date(event.end),
                title: event.title,
            };
        });
        if (events) {
            this.setState({
                events: newEvents,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.events !== this.state.events) {
            const newEvents = this.state.events.map((event) => {
                return {
                    id: event.id,
                    start: new Date(event.start).getTime(),
                    end: new Date(event.end).getTime(),
                    title: event.title,
                };
            });

            const events = JSON.stringify(newEvents);
            localStorage.setItem('events', events);
        }
    }

    onEventResize = (data) => {
        const { event, start, end } = data;

        const { events } = this.state;

        const nextEvents = events.map((existingEvent) => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent;
        });

        this.setState({
            events: nextEvents,
        });
    };

    onEventDrop = ({ event, start, end }) => {
        const { events } = this.state;

        const nextEvents = events.map((existingEvent) => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent;
        });

        this.setState({
            events: nextEvents,
        });
    };

    handleSelect = ({ start, end, action }) => {
        if (action === 'doubleClick') {
            const title = window.prompt('New Event name');
            let idList = this.state.events.map((a) => a.id);
            let newId = Math.max(...idList) + 1;
            if (newId === -Infinity) {
                newId = 0;
            }

            if (title)
                this.setState({
                    events: [
                        ...this.state.events,
                        {
                            id: newId,
                            start,
                            end,
                            title,
                        },
                    ],
                });
        }
    };

    deleteHandler = (event) => {
        if (window.confirm(`Hapus ${event.title}?`)) {
            const newEvents = this.state.events.filter(
                (i) => i.id !== event.id
            );
            this.setState({ events: newEvents });
        }
    };

    render() {
        const colors = [
            'tomato',
            'dodgerblue',
            'lightsalmon',
            'indigo',
            'lightseagreen',
            'orangered',
            'teal',
        ];

        const isSameName = (events, event) => {
            const newId = events.filter((item) => item.title.toLowerCase() === event.title.toLowerCase());
            return newId[0].id;
        };

        return (
            <DnDCalendar
                selectable
                resizable
                defaultDate={moment().toDate()}
                defaultView="month"
                events={this.state.events}
                localizer={localizer}
                onEventDrop={this.onEventDrop}
                onEventResize={this.onEventResize}
                onDoubleClickEvent={this.deleteHandler}
                onSelectSlot={this.handleSelect}
                style={{ height: '90vh', width: '90vw', margin: 'auto' }}
                eventPropGetter={(event) => {
                    const newId = isSameName(this.state.events, event);
                    const colorNumber = newId % colors.length;
                    const newStyle = {
                        backgroundColor: colors[colorNumber],
                        border: 'none',
                    };

                    return {
                        className: '',
                        style: newStyle,
                    };
                }}
            />
        );
    }
}

export default MainCalendar;
