<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function index()
    {
        return response()->json(Shift::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'is_night' => 'boolean',
            'description' => 'nullable|string',
        ]);
        $shift = Shift::create($data);
        return response()->json($shift, 201);
    }

    public function update(Request $request, Shift $shift)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'is_night' => 'sometimes|boolean',
            'description' => 'nullable|string',
        ]);
        $shift->update($data);
        return response()->json($shift);
    }

    public function destroy(Shift $shift)
    {
        $shift->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

