<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Buyer extends Authenticatable
{
    use HasFactory;

    protected $table = 'buyer';

    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'password',
        'email',
        'phone',
    ];

    protected $hidden = [
        'password',
    ];

    protected $primaryKey = 'buyer_id';
}
