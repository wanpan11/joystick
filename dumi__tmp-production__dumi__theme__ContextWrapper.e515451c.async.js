"use strict";(self.webpackChunkjoystick_kit=self.webpackChunkjoystick_kit||[]).push([[923],{84655:function(D,r,e){e.r(r),e.d(r,{default:function(){return k}});var g=e(48305),y=e.n(g),n=e(75271),o=e(95269),C=e(2405),j=e(10220),a=null,s=e(31532),x=e(52676),l={},i={name:"joystick-kit",description:"A react library developed with dumi",version:"2.0.0",license:"MIT",authors:[]},u="browser",d=void 0,v={logo:!1,footer:'Copyright \xA9 2024 | Powered by <a href="https://d.umijs.org" target="_blank" rel="noreferrer">dumi</a>',prefersColor:{default:"light",switch:!0},nprogress:!0,lastUpdated:!0,name:"home"},m=!0;function k(){var T=(0,o.pC)(),E=(0,n.useState)(!1),c=y()(E,2),f=c[0],h=c[1],p=(0,n.useRef)(o.m8.location.pathname);(0,n.useEffect)(function(){return o.m8.listen(function(t){t.location.pathname!==p.current&&(p.current=t.location.pathname,document.documentElement.scrollTo(0,0))})},[]);var A=n.useMemo(function(){var t={pkg:i,historyType:u,entryExports:l,demos:null,components:a,locales:s.k,loading:f,setLoading:h,hostname:d,themeConfig:v,_2_level_nav_available:m};return Object.defineProperty(t,"demos",{get:function(){return(0,C.Kp)(!1,"`demos` return empty in latest version, please use `useDemo` instead."),{}}}),t},[i,u,l,a,s.k,f,h,d,v,m]);return(0,x.jsx)(j.D.Provider,{value:A,children:T})}}}]);
