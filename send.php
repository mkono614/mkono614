<?php

// 送るメッセージ
$json = '{
"notification":
{
    "title": "タイトルが入ります",
    "body": "本文が入ります",
    "icon": "https://●●●●●●●●●.com/message.png",
    "click_action": "https://●●●●●●●●●.com/"
},
"to": "<コピーしたトークン>"
}';

$ch = curl_init();

$headers = array(
    'Content-Type: application/json',
    'Authorization: key=AAAAwo_60Mo:APA91bFqdp3aSXSU5s2r5L_Ca1ZOUFMD2SuOmOROBXE8eB3L5yFR3BtjAI9Tg754skp1h4gD9XF637eywHi2yrrwD81LOsX7YR8NIklVTpjIhagULXKi0GQyi0eerMi9mMHZlfSZsEVW'
);

curl_setopt_array($ch, array(
    CURLOPT_URL => 'https://fcm.googleapis.com/fcm/send',
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => $json
));

$response = curl_exec($ch);

curl_close($ch);

?>