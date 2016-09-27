//
//  ViewController.swift
//  lab3
//
//  Created by Rohan Bhansali on 26/9/16.
//  Copyright © 2016 Rohan Bhansali. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
	
	@IBOutlet weak var widthSlider: UISlider!
	@IBOutlet weak var alphaSlider: UISlider!
	var thickness = CGFloat(15);
	
	var colors:[UIColor] = [
		UIColor(red:0.82, green:0.00, blue:0.00, alpha:1.0),
		UIColor(red:0.00, green:0.44, blue:0.74, alpha:1.0),
		UIColor(red:0.00, green:0.67, blue:0.39, alpha:1.0),
		UIColor(red:1.00, green:0.95, blue:0.10, alpha:1.0),
		UIColor(red:0.48, green:0.12, blue:0.69, alpha:1.0),
		UIColor(red:1.00, green:0.65, blue:0.00, alpha:1.0)
	]
	
	var currentColor = UIColor()
	var currentPath:[CGPoint] = []
	var paths:[UIBezierPath] = []
	
	override func viewDidLoad() {
		super.viewDidLoad()
		currentColor = colors[0]
		previewBrush()
	}

	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
	}
	
	@IBAction func changeColor(sender: AnyObject) {
		currentColor = colors[sender.tag].colorWithAlphaComponent(CGFloat(alphaSlider.value))
		previewBrush()
	}
	
	//CREATIVE PORTION: Added an opacity filter to the selected color
	@IBAction func opacitySliderChanged(sender: AnyObject) {
		currentColor = currentColor.colorWithAlphaComponent(CGFloat(alphaSlider.value))
		previewBrush()
	}
	
	@IBAction func widthSliderChanged(sender: AnyObject) {
		thickness = CGFloat(5 + Double(widthSlider.value))
		previewBrush()
	}
	
	@IBAction func resetDrawing(sender: AnyObject) {
		for layer: CALayer in self.view.layer.sublayers! {
			if(layer.name != nil && (layer.name!.containsString("path") || layer.name!.containsString("moving"))){
				layer.removeFromSuperlayer()
			}
		}
		paths.removeAll()
	}
	
	@IBAction func undoButtonPressed(sender: AnyObject) {
		if(paths.count > 0){
			self.view.layer.sublayers?.removeLast()
			paths.removeLast()
		}
	}
	
	//CREATIVE PORTION: Draws a preview of the brush with the correct opacity/thickness
	func previewBrush(){
		//Remove old preview
		for layer: CALayer in self.view.layer.sublayers! {
			if(layer.name != nil && layer.name!.containsString("preview")){
				layer.removeFromSuperlayer()
			}
		}
		//Add new preview
		let preview = UIBezierPath(roundedRect: CGRectMake(194.0 - (thickness/2), 530.0-(thickness/2), thickness/2, thickness/2), cornerRadius: thickness/2)
		draw(preview, fill:currentColor, shapeName: "preview")
	}
	
	override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
		let touchPoint = (touches.first)!.locationInView(self.view) as CGPoint
		currentPath.append(touchPoint)
	}
	
	override func touchesMoved(touches: Set<UITouch>, withEvent event: UIEvent?) {
		for t in touches {
			currentPath.append(t.locationInView(self.view) as CGPoint)
			//draw path while gesture incomplete (opacity does not work)
			draw(createQuadPath(currentPath),fill: UIColor.clearColor(),shapeName: "moving")
		}
		
		
	}
	
	override func touchesEnded(touches: Set<UITouch>, withEvent event: UIEvent?) {
		//remove temporary path created in touchesMoved()
		for layer: CALayer in self.view.layer.sublayers! {
			if(layer.name != nil && layer.name!.containsString("moving")){
				layer.removeFromSuperlayer()
			}
		}
		
		//redraw permanent path with correct opacity
		var p = UIBezierPath()
		var fill = UIColor()
		if(currentPath.count > 1){
			p = createQuadPath(currentPath)
			fill = UIColor.clearColor()
		}
		else{
			//if screen is just tapped and not dragged
			p = UIBezierPath(roundedRect: CGRectMake(currentPath[0].x - thickness/2, currentPath[0].y-thickness/2, thickness/2, thickness/2), cornerRadius: thickness/2)
			fill = currentColor
		}
		draw(p,fill: fill,shapeName: "path")
		
		//Add to paths array and reset currentPath
		paths.append(p);
		currentPath = []
	}
	
	//Helper function to draw UIBezierPath, fill with UIColor, and assign the name -> ShapeName and then add to layer
	func draw(p: UIBezierPath, fill: UIColor, shapeName: String){
		let shapeLayer = CAShapeLayer()
		shapeLayer.path = p.CGPath
		shapeLayer.strokeColor = currentColor.CGColor
		shapeLayer.fillColor = fill.CGColor
		shapeLayer.lineWidth = thickness
		shapeLayer.name = shapeName
		self.view.layer.addSublayer(shapeLayer)
	}
	
	//Calculate the midpoint between two CGpoints
	private func findMidpoint(firstPoint: CGPoint, secondPoint: CGPoint) -> CGPoint {
		return CGPoint(x: (firstPoint.x+secondPoint.x)/2,y: (firstPoint.y+secondPoint.y)/2)
	}
	
	//Smooth curve. Taken from lab write up
	func createQuadPath(arrayOfPoints: [CGPoint]) -> UIBezierPath {
		let newPath = UIBezierPath()
		let firstLocation = arrayOfPoints[0]
		newPath.moveToPoint(firstLocation)
		let secondLocation = arrayOfPoints[1]
		let firstMidpoint = findMidpoint(firstLocation, secondPoint: secondLocation)
		newPath.addLineToPoint(firstMidpoint)
		for index in 1 ..< arrayOfPoints.count-1 {
			let currentLocation = arrayOfPoints[index]
			let nextLocation = arrayOfPoints[index + 1]
			let midpoint = findMidpoint(currentLocation, secondPoint: nextLocation)
			newPath.addQuadCurveToPoint(midpoint, controlPoint: currentLocation)
		}
		let lastLocation = arrayOfPoints.last
		newPath.addLineToPoint(lastLocation!)
		return newPath
	}
}