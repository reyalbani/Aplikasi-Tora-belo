<?php
auth()->login(\App\Models\User::first());
$res = app()->make(\App\Http\Controllers\Admin\AccountRequestController::class)->index(request());
$data = $res->toResponse(request())->getOriginalContent()->getData();
echo json_encode($data['page']['props']);
