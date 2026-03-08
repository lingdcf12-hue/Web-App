<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'type',
        'amount',
        'category',
        'date',
        'notes',
    ];

    protected $casts = [
        'date' => 'datetime:Y-m-d\TH:i:s.000\Z',
        'created_at' => 'datetime:Y-m-d\TH:i:s.000\Z',
        'updated_at' => 'datetime:Y-m-d\TH:i:s.000\Z',
    ];

    public function getIncrementing()
    {
        return true;
    }

    public function getKeyType()
    {
        return 'int';
    }
}
