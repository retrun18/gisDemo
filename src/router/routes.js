export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index')},
      {path:'page1',component:()=>import('pages/page1')},
      {path:'page2',component:()=>import("pages/page2")},
      {path:'page3',component:()=>import("pages/page3")},
      {path:'page4',component:()=>import("pages/page4")},
      {path:'page5',component:()=>import("pages/page5")},
      {path:'page6',component:()=>import("pages/page6")},
      {path:'page7',component:()=>import("pages/page7")}
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
